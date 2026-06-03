'use client';

import React from 'react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", backgroundColor: '#FCFCFB', color: '#0B1730' }}>
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

        @media (max-width: 1024px) { .header { padding: 0 32px; } }
        @media (max-width: 768px) { .header { padding: 0 24px; height: 72px; } }

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
          justify-content: center;
        }

        @media (max-width: 768px) { .nav { display: none; } }

        .nav a {
          font-size: 14px;
          font-weight: 500;
          color: #0B1730;
          text-decoration: none;
        }

        .nav a:hover { color: #6A7485; }

        .header-right {
          display: flex;
          gap: 24px;
          align-items: center;
          flex-shrink: 0;
        }

        .header-right a {
          font-size: 14px;
          font-weight: 500;
          color: #0B1730;
          text-decoration: none;
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
        }

        .btn:hover { background: #1a2a4a; }

        .hero {
          padding: 80px 48px;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 768px) { .hero { padding: 48px 24px; } }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: flex-start;
        }

        @media (max-width: 1024px) { .hero-grid { gap: 64px; } }
        @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr; gap: 48px; } }

        .hero-left h1 {
          font-size: 72px;
          font-weight: 700;
          line-height: 84px;
          margin-bottom: 32px;
          color: #0B1730;
        }

        @media (max-width: 768px) { .hero-left h1 { font-size: 48px; line-height: 56px; margin-bottom: 24px; } }

        .hero-left p {
          font-size: 20px;
          font-weight: 400;
          line-height: 32px;
          margin-bottom: 16px;
          color: #0B1730;
        }

        .cta-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 32px;
          margin-bottom: 32px;
        }

        .btn-secondary {
          background: transparent;
          color: #0B1730;
          border: none;
          padding: 0;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .trust-line {
          font-size: 14px;
          font-weight: 500;
          color: #6A7485;
          margin-top: 24px;
        }

        .report-card {
          background: #FCFCFB;
          border: 2px solid #0B1730;
          padding: 48px;
        }

        @media (max-width: 768px) { .report-card { padding: 36px; } }

        .report-metadata {
          background: #0B1730;
          color: #FCFCFB;
          padding: 16px 24px;
          margin: -48px -48px 32px -48px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 24px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) { .report-metadata { margin: -36px -36px 24px -36px; padding: 12px 20px; grid-template-columns: repeat(2, 1fr); } }

        .metadata-item label {
          display: block;
          margin-bottom: 4px;
          opacity: 0.8;
        }

        .metadata-item {
          font-size: 12px;
          font-weight: 400;
          text-transform: none;
        }

        .report-factors {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid #6A7485;
        }

        @media (max-width: 768px) { .report-factors { grid-template-columns: 1fr; gap: 24px; } }

        .factor {
          padding-bottom: 24px;
          border-bottom: 1px solid #6A7485;
        }

        .factor:last-child { border-bottom: none; padding-bottom: 0; }

        .factor-name {
          font-size: 16px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 4px;
        }

        .factor-desc {
          font-size: 13px;
          color: #6A7485;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .factor-score {
          font-size: 56px;
          font-weight: 700;
          color: #0B1730;
          font-family: 'IBM Plex Mono', monospace;
        }

        .report-section {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #6A7485;
        }

        .report-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

        .section-title {
          font-size: 12px;
          font-weight: 600;
          color: #0B1730;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .report-list {
          list-style: none;
          margin: 0 0 12px 0;
          padding: 0;
          font-size: 13px;
        }

        .report-list li {
          margin-bottom: 6px;
        }

        .report-list.teal li { color: #1B6873; }
        .report-list li { color: #0B1730; }

        .section-desc {
          font-size: 12px;
          color: #6A7485;
          font-weight: 400;
        }

        .section {
          padding: 160px 48px;
          max-width: 1600px;
          margin: 0 auto;
          border-top: 1px solid #6A7485;
        }

        @media (max-width: 768px) { .section { padding: 80px 24px; } }

        .section-number {
          font-size: 14px;
          font-weight: 600;
          color: #6A7485;
          font-family: 'IBM Plex Mono', monospace;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section h2 {
          font-size: 48px;
          font-weight: 600;
          line-height: 56px;
          margin-bottom: 64px;
          color: #0B1730;
        }

        @media (max-width: 768px) { .section h2 { font-size: 36px; line-height: 44px; margin-bottom: 48px; } }

        .section-white { background: #FCFCFB; color: #0B1730; }
        .section-navy { background: #0B1730; color: #FCFCFB; }

        .intro-text {
          font-size: 20px;
          font-weight: 400;
          line-height: 32px;
          margin-bottom: 64px;
          color: inherit;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 64px;
        }

        @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; gap: 40px; } }

        .profile-card {
          background: #FCFCFB;
          border: 2px solid #0B1730;
          padding: 48px;
        }

        @media (max-width: 768px) { .profile-card { padding: 36px; } }

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

        .profile-list li { margin-bottom: 12px; }

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
          border: 2px solid #0B1730;
          padding: 48px;
          margin-top: 64px;
        }

        @media (max-width: 768px) { .insight-box { padding: 36px; margin-top: 48px; } }

        .insight-box h3 {
          font-size: 14px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .insight-box p {
          font-size: 16px;
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

        .three-col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }

        @media (max-width: 768px) { .three-col { grid-template-columns: 1fr; gap: 32px; } }

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

        .showcase-section {
          padding: 280px 48px;
          max-width: 1600px;
          margin: 0 auto;
          border-top: 1px solid #6A7485;
        }

        @media (max-width: 768px) { .showcase-section { padding: 160px 24px; } }

        .showcase-section h2 {
          font-size: 48px;
          font-weight: 600;
          line-height: 56px;
          margin-bottom: 64px;
          color: #0B1730;
        }

        .showcase-report {
          background: #FCFCFB;
          border: 2px solid #0B1730;
          padding: 64px;
          margin-bottom: 64px;
        }

        @media (max-width: 768px) { .showcase-report { padding: 48px; } }

        .showcase-score {
          font-size: 72px;
          font-weight: 700;
          color: #0B1730;
          font-family: 'IBM Plex Mono', monospace;
          margin-bottom: 8px;
        }

        .showcase-class {
          font-size: 28px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid #6A7485;
        }

        .showcase-factors {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid #6A7485;
        }

        @media (max-width: 768px) { .showcase-factors { grid-template-columns: 1fr; gap: 24px; } }

        .showcase-factor {
          padding-bottom: 24px;
          border-bottom: 1px solid #6A7485;
        }

        .showcase-factor:last-child { border-bottom: none; }

        .showcase-factor-name {
          font-size: 16px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 4px;
        }

        .showcase-factor-desc {
          font-size: 13px;
          color: #6A7485;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .showcase-factor-score {
          font-size: 48px;
          font-weight: 700;
          color: #0B1730;
          font-family: 'IBM Plex Mono', monospace;
        }

        .explanation-box {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #6A7485;
        }

        .explanation-box:last-child { border-bottom: none; }

        .explanation-box h4 {
          font-size: 14px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .explanation-box p {
          font-size: 14px;
          color: #0B1730;
          line-height: 24px;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .explanation-box p:last-child { margin-bottom: 0; }

        .full-analysis {
          background: #0B1730;
          color: #FCFCFB;
          padding: 48px;
          margin-top: 64px;
        }

        .full-analysis h4 {
          font-size: 14px;
          font-weight: 600;
          color: #FCFCFB;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .full-analysis p {
          font-size: 16px;
          font-weight: 700;
          color: #FCFCFB;
          margin-bottom: 8px;
          line-height: 24px;
        }

        .full-analysis p:last-child { margin-bottom: 0; font-weight: 400; }

        .horizontal-explanation {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          margin-bottom: 64px;
        }

        @media (max-width: 768px) { .horizontal-explanation { grid-template-columns: 1fr; gap: 32px; } }

        .explanation-item h3 {
          font-size: 20px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 12px;
        }

        .explanation-item p {
          font-size: 16px;
          font-weight: 400;
          line-height: 28px;
          color: #0B1730;
        }

        .why-matters-box {
          background: #FCFCFB;
          border: 2px solid #0B1730;
          padding: 48px;
        }

        @media (max-width: 768px) { .why-matters-box { padding: 36px; } }

        .why-matters-box h4 {
          font-size: 14px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .why-matters-box p {
          font-size: 16px;
          font-weight: 400;
          line-height: 28px;
          color: #0B1730;
          margin-bottom: 12px;
        }

        .why-matters-box p:last-child { margin-bottom: 0; }

        .framework-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          margin-bottom: 64px;
        }

        @media (max-width: 768px) { .framework-grid { grid-template-columns: 1fr; gap: 32px; } }

        .framework-item h3 {
          font-size: 16px;
          font-weight: 600;
          color: #0B1730;
        }

        .navy-section {
          background: #0B1730;
          color: #FCFCFB;
          padding: 48px;
          margin-top: 64px;
        }

        .navy-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #FCFCFB;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .navy-section p {
          font-size: 16px;
          font-weight: 400;
          line-height: 28px;
          color: #FCFCFB;
          margin-bottom: 16px;
        }

        .navy-section p:last-child { margin-bottom: 0; }

        .vertical-access {
          max-width: 600px;
          margin: 0 auto;
        }

        .access-tier {
          background: #FCFCFB;
          border: 2px solid #0B1730;
          padding: 48px;
          margin-bottom: 32px;
        }

        @media (max-width: 768px) { .access-tier { padding: 36px; } }

        .tier-name {
          font-size: 28px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 8px;
        }

        .tier-price {
          font-size: 16px;
          font-weight: 600;
          color: #6A7485;
          margin-bottom: 16px;
        }

        .tier-desc {
          font-size: 14px;
          color: #0B1730;
          font-weight: 400;
          margin-bottom: 24px;
        }

        .tier-includes {
          font-size: 11px;
          font-weight: 600;
          color: #0B1730;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .tier-list {
          list-style: none;
          margin: 0 0 24px 0;
          padding: 0;
          font-size: 13px;
          color: #0B1730;
          line-height: 20px;
        }

        .tier-list li { margin-bottom: 8px; }
        .tier-list li:last-child { margin-bottom: 0; }

        .tier-btn {
          background: #0B1730;
          color: #FCFCFB;
          border: none;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }

        .tier-btn:hover { background: #1a2a4a; }

        .arrow-divider {
          text-align: center;
          font-size: 24px;
          color: #6A7485;
          margin: 16px 0;
        }

        .institutional-rows {
          margin-top: 64px;
          background: #0B1730;
          color: #FCFCFB;
          padding: 48px;
        }

        .institutional-rows p {
          font-size: 16px;
          font-weight: 400;
          line-height: 28px;
          margin-bottom: 16px;
        }

        .institutional-rows p:last-child { margin-bottom: 0; }

        .row-item {
          font-size: 14px;
          font-weight: 600;
          color: #FCFCFB;
          margin-top: 12px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(252, 252, 251, 0.2);
        }

        .row-item:last-child { border-bottom: none; }

        .clarification-section {
          padding: 160px 48px;
          max-width: 760px;
          margin: 0 auto;
          border-top: 1px solid #6A7485;
        }

        @media (max-width: 768px) { .clarification-section { padding: 80px 24px; } }

        .clarification-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #0B1730;
          text-transform: uppercase;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }

        .clarification-section p {
          font-size: 14px;
          color: #0B1730;
          line-height: 24px;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .clarification-section p:last-child { margin-bottom: 0; }

        .final-cta {
          padding: 160px 48px;
          background: #0B1730;
          color: #FCFCFB;
          text-align: center;
          border-top: 1px solid #6A7485;
        }

        @media (max-width: 768px) { .final-cta { padding: 80px 24px; } }

        .final-cta h2 {
          font-size: 48px;
          font-weight: 600;
          line-height: 56px;
          margin-bottom: 32px;
        }

        @media (max-width: 768px) { .final-cta h2 { font-size: 36px; line-height: 44px; } }

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

        .footer {
          background: #0B1730;
          color: #FCFCFB;
          padding: 160px 48px 64px;
          border-top: 1px solid #6A7485;
        }

        @media (max-width: 768px) { .footer { padding: 80px 24px 48px; } }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 96px;
          max-width: 1600px;
          margin: 0 auto 96px;
        }

        @media (max-width: 1024px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 64px; margin-bottom: 80px; } }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 48px; margin-bottom: 64px; } }

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

        .footer-links li { margin-bottom: 16px; }
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
          border-top: 1px solid rgba(252, 252, 251, 0.2);
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
          <Image src="/RunPayway_Logo.svg" alt="RunPayway" width={160} height={32} className="logo" priority />
          <nav className="nav">
            <a href="#how-it-works">How It Works</a>
            <a href="#methodology">Methodology</a>
            <a href="#when-it-matters">When It Matters</a>
            <a href="#solutions">Solutions</a>
            <a href="#learn">Learn</a>
          </nav>
          <div className="header-right">
            <a href="#sign-in">Sign In</a>
            <button className="btn" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-left">
            <h1>Before relying on income, know your Income Stability.</h1>
            <p>RunPayway™ measures Income Stability.</p>
            <p>Income Stability measures the structure supporting income.</p>
            <div className="cta-group">
              <button className="btn" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
              <button className="btn-secondary" onClick={() => window.location.href = '/#'}>See How It Works</button>
            </div>
          </div>

          <div className="report-card">
            {/* METADATA BAR - CHANGE #3: Reduced prominence */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '10px', marginBottom: '36px', paddingBottom: '16px', borderBottom: '1px solid rgba(106, 116, 133, 0.3)' }}>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.4px' }}>Report ID</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 400, fontFamily: "'IBM Plex Mono', monospace" }}>RP2-2026-00012874</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.4px' }}>Model</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 400 }}>RP-2.0</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.4px' }}>Verification</div>
                <div style={{ fontSize: '10px', color: '#1B6873', fontWeight: 400 }}>Verified</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.4px' }}>Issued</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 400 }}>06/03/2026</div>
              </div>
            </div>

            {/* CHANGE #4: Category reinforcement */}
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#6A7485', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '24px' }}>A standardized measurement of Income Stability.</div>

            {/* SCORE BLOCK */}
            <div style={{ marginBottom: '56px', paddingBottom: '48px', borderBottom: '1px solid #6A7485' }}>
              <div style={{ fontSize: '96px', fontWeight: 700, color: '#1B6873', fontFamily: "'IBM Plex Mono', monospace", marginBottom: '12px', lineHeight: '1' }}>72</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#0B1730', marginBottom: '12px' }}>Income Stability Score™</div>
              <div style={{ fontSize: '32px', fontWeight: 600, color: '#1B6873', marginBottom: '32px' }}>Established Stability</div>
              <div style={{ fontSize: '15px', color: '#0B1730', lineHeight: '28px', fontWeight: 400 }}>Several structural characteristics are supporting Income Stability.</div>
            </div>

            {/* CHANGE #2: Why This Result heading + STRUCTURE CHANGE: Interpreted format without symbols */}
            <div style={{ marginBottom: '48px', paddingBottom: '0' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0B1730', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '32px', fontFamily: "'IBM Plex Mono', sans-serif" }}>Why This Result</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                {/* What Strengthened This Result */}
                <div style={{ paddingBottom: '48px', borderRight: '1px solid #6A7485' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1B6873', marginBottom: '24px' }}>What Strengthened This Result</div>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730', marginBottom: '4px' }}>Income Concentration</div>
                    <div style={{ fontSize: '13px', color: '#6A7485', fontWeight: 400 }}>Strong contributor to stability.</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730', marginBottom: '4px' }}>Income Diversity</div>
                    <div style={{ fontSize: '13px', color: '#6A7485', fontWeight: 400 }}>Strong contributor to stability.</div>
                  </div>
                </div>

                {/* What Created Pressure */}
                <div style={{ paddingBottom: '48px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#0B1730', marginBottom: '24px' }}>What Created Pressure</div>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730', marginBottom: '4px' }}>Forward Visibility</div>
                    <div style={{ fontSize: '13px', color: '#6A7485', fontWeight: 400 }}>Limited future income visibility.</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730', marginBottom: '4px' }}>Continuity Strength</div>
                    <div style={{ fontSize: '13px', color: '#6A7485', fontWeight: 400 }}>Moderate continuity of income relationships.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CHANGE #1: Institutional statement replacing trust line */}
            <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #6A7485', fontSize: '11px', color: '#6A7485', fontWeight: 400 }}>
              Standardized measurement using Structural Stability Model RP-2.0
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', paddingTop: '24px' }}>
              <a href="/#" style={{ fontSize: '14px', fontWeight: 600, color: '#1B6873', textDecoration: 'none', display: 'inline-block' }}>View Example Income Stability Profile™ →</a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01 */}
      <section className="section section-white">
        <div className="section-number">01</div>
        <h2>Income and Income Stability are not the same thing.</h2>

        <div style={{ marginBottom: '64px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0B1730', marginBottom: '48px' }}>Same Income. Different Stability.</h3>
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
              <div className="profile-class">Developing Stability</div>
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
              <div className="profile-class">Established Stability</div>
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

      {/* SECTION 02 */}
      <section className="section section-white">
        <div className="section-number">02</div>
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

      {/* SECTION 03 - SHOWCASE */}
      <section className="showcase-section" style={{ backgroundColor: '#FCFCFB' }}>
        <div className="section-number" style={{ marginBottom: '24px' }}>03</div>
        <h2>Sample Income Stability Profile</h2>

        <div className="showcase-report">
          {/* SCORE SUMMARY */}
          <div style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #6A7485' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
              <div style={{ fontSize: '72px', fontWeight: 700, color: '#1B6873', fontFamily: "'IBM Plex Mono', monospace", lineHeight: '1' }}>72</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0B1730' }}>Income Stability Score™</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#1B6873', marginBottom: '24px' }}>Established Stability</div>
            <div style={{ fontSize: '14px', color: '#0B1730', lineHeight: '24px', fontWeight: 400 }}>Established Stability reflects an income structure with several characteristics that support stability while maintaining a limited number of pressure areas.</div>
          </div>

          {/* WHAT STRENGTHENED STABILITY */}
          <div style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #6A7485' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0B1730', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '24px' }}>What Strengthened Stability</div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730' }}>Income Concentration</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#1B6873', fontFamily: "'IBM Plex Mono', monospace" }}>82</div>
              </div>
              <div style={{ fontSize: '13px', color: '#6A7485', fontWeight: 400 }}>Strong contributor to stability.</div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730' }}>Income Diversity</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#1B6873', fontFamily: "'IBM Plex Mono', monospace" }}>76</div>
              </div>
              <div style={{ fontSize: '13px', color: '#6A7485', fontWeight: 400 }}>Strong contributor to stability.</div>
            </div>
          </div>

          {/* WHAT CREATED PRESSURE */}
          <div style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #6A7485' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0B1730', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '24px' }}>What Created Pressure</div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730' }}>Forward Visibility</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#0B1730', fontFamily: "'IBM Plex Mono', monospace" }}>41</div>
              </div>
              <div style={{ fontSize: '13px', color: '#6A7485', fontWeight: 400 }}>Limited visibility into future income commitments.</div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730' }}>Continuity Strength</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#0B1730', fontFamily: "'IBM Plex Mono', monospace" }}>55</div>
              </div>
              <div style={{ fontSize: '13px', color: '#6A7485', fontWeight: 400 }}>Moderate continuity in income relationships.</div>
            </div>
          </div>

          {/* ADDITIONAL STRUCTURAL FACTORS */}
          <div style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #6A7485' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0B1730', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '24px' }}>Additional Structural Factors</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730' }}>Stability Pattern</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#6A7485', fontFamily: "'IBM Plex Mono', monospace" }}>68</div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0B1730' }}>Dependency Exposure</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#0B1730', fontFamily: "'IBM Plex Mono', monospace" }}>71</div>
                </div>
              </div>
            </div>
          </div>

          {/* VERIFICATION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', fontSize: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0B1730', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Model Version</div>
              <div style={{ fontSize: '13px', color: '#0B1730', fontWeight: 500 }}>RP-2.0</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0B1730', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Report ID</div>
              <div style={{ fontSize: '13px', color: '#0B1730', fontWeight: 500, fontFamily: "'IBM Plex Mono', monospace" }}>RP2-2026-00012874</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0B1730', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Verification</div>
              <div style={{ fontSize: '13px', color: '#1B6873', fontWeight: 500 }}>Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 */}
      <section className="section section-white">
        <div className="section-number">04</div>
        <h2>Understanding Your Income Stability Profile</h2>
        <div className="horizontal-explanation">
          <div className="explanation-item">
            <h3>Income Stability Profile</h3>
            <p>The structural factors that influence Income Stability.</p>
          </div>
          <div className="explanation-item">
            <h3>Income Stability Score</h3>
            <p>A standardized measurement of Income Stability.</p>
          </div>
          <div className="explanation-item">
            <h3>Stability Class</h3>
            <p>A classification that helps place the result into context.</p>
          </div>
        </div>
        <div className="why-matters-box">
          <h4>Why This Matters</h4>
          <p>The profile explains the score.</p>
          <p>The score summarizes the profile.</p>
          <p>Together they provide a clearer understanding of Income Stability.</p>
          <button className="btn" onClick={() => window.location.href = '/assessment'} style={{ marginTop: '24px' }}>Reveal My Result →</button>
        </div>
      </section>

      {/* SECTION 05 */}
      <section className="section section-white">
        <div className="section-number">05</div>
        <h2>What RunPayway Evaluates</h2>
        <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: '28px', marginBottom: '64px', color: '#0B1730' }}>RunPayway™ evaluates structural factors that contribute to Income Stability.</p>
        <div className="framework-grid">
          <div className="framework-item"><h3>Income Concentration</h3></div>
          <div className="framework-item"><h3>Income Diversity</h3></div>
          <div className="framework-item"><h3>Forward Visibility</h3></div>
          <div className="framework-item"><h3>Stability Pattern</h3></div>
          <div className="framework-item"><h3>Continuity Strength</h3></div>
          <div className="framework-item"><h3>Dependency Exposure</h3></div>
        </div>
        <div className="navy-section">
          <h4>Why This Matters</h4>
          <p>Income measures amount.</p>
          <p>RunPayway™ measures stability.</p>
          <p>Income amount alone may not reveal these structural characteristics. RunPayway™ evaluates them using a consistent methodology.</p>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1B6873', cursor: 'pointer', marginTop: '32px' }}>Learn More About The Methodology →</div>
        </div>
      </section>

      {/* SECTION 06 */}
      <section className="section section-white">
        <div className="section-number">06</div>
        <h2>Understanding Income Stability</h2>
        <div className="vertical-access">
          <div className="access-tier">
            <div className="tier-name">Assessment</div>
            <div className="tier-price">FREE</div>
            <div className="tier-desc">Discover your result.</div>
            <div className="tier-includes">Includes:</div>
            <ul className="tier-list">
              <li>Assessment Completion</li>
              <li>Income Structure Evaluation</li>
              <li>Eligibility to Unlock Your Result</li>
            </ul>
            <button className="tier-btn" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
          </div>

          <div className="arrow-divider">↓</div>

          <div className="access-tier">
            <div className="tier-name">Result</div>
            <div className="tier-price">$9</div>
            <div className="tier-desc">See where you stand.</div>
            <div className="tier-includes">Includes:</div>
            <ul className="tier-list">
              <li>Income Stability Profile</li>
              <li>Stability Class</li>
              <li>Income Stability Score</li>
              <li>Supporting Drivers</li>
              <li>Stability Pressure Factors</li>
            </ul>
            <button className="tier-btn" onClick={() => window.location.href = '/unlock'}>Reveal My Result →</button>
          </div>

          <div className="arrow-divider">↓</div>

          <div className="access-tier">
            <div className="tier-name">Analysis</div>
            <div className="tier-price">$69</div>
            <div className="tier-desc">Understand why.</div>
            <div className="tier-includes">Includes everything in the Result plus:</div>
            <ul className="tier-list">
              <li>Why This Score?</li>
              <li>What This Means</li>
              <li>Improvement Opportunities</li>
              <li>What's Supporting Stability</li>
              <li>What May Be Affecting Stability</li>
              <li>Areas Worth Reviewing</li>
              <li>Industry Context</li>
              <li>Analysis Observations</li>
            </ul>
            <button className="tier-btn" onClick={() => window.location.href = '/analysis'}>Understand My Income Stability →</button>
          </div>
        </div>
      </section>

      {/* SECTION 07 */}
      <section className="section section-navy">
        <div className="section-number" style={{ color: '#FCFCFB' }}>07</div>
        <h2 style={{ color: '#FCFCFB' }}>Why Results Remain Consistent</h2>
        <div className="institutional-rows">
          <p>Results are generated using Structural Stability Model RP-2.0.</p>
          <div className="row-item">Same Inputs</div>
          <div className="row-item">Same Methodology</div>
          <div className="row-item">Same Outputs</div>
          <div className="row-item">Verifiable Reports</div>
          <p style={{ marginTop: '32px' }}>No human overrides.</p>
          <p>No subjective scoring.</p>
          <p>No changing standards.</p>
          <p style={{ marginTop: '16px' }}>Income measures amount.</p>
          <p>RunPayway™ measures stability.</p>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1B6873', cursor: 'pointer', marginTop: '32px' }}>Learn More About The Methodology →</div>
        </div>
      </section>

      {/* SYSTEM CLARIFICATION */}
      <div className="clarification-section">
        <h3>System Clarification</h3>
        <p>RunPayway™ measures Income Stability using a standardized methodology.</p>
        <p>Income measures amount.</p>
        <p>RunPayway™ measures stability.</p>
        <p>RunPayway™ is not a credit score, lending decision, investment recommendation, financial plan, employment evaluation, or prediction of future income.</p>
        <p>Results are generated using Structural Stability Model RP-2.0 and are intended to provide a consistent measurement of Income Stability based on information supplied during the assessment.</p>
        <p style={{ marginTop: '12px' }}>Model Version: RP-2.0</p>
        <p>Report Verification: Available on all issued reports</p>
      </div>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2>Before relying on income, know your Income Stability.</h2>
        <p className="final-subtitle">Start your Income Stability Assessment in under 2 minutes.</p>
        <button className="btn" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
        <p className="final-trust">Free structural insight · No documents required</p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#methodology">Methodology</a></li>
              <li><a href="#profile">Income Stability Profile</a></li>
              <li><a href="#score">Income Stability Score</a></li>
              <li><a href="#analysis">Income Stability Analysis</a></li>
              <li><a href="#verify">Verify A Report</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Solutions</h4>
            <ul className="footer-links">
              <li><a href="#individuals">Individuals</a></li>
              <li><a href="#advisors">Advisors</a></li>
              <li><a href="#organizations">Organizations</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Learn</h4>
            <ul className="footer-links">
              <li><a href="#what-is">What Is Income Stability?</a></li>
              <li><a href="#vs-income">Income Stability vs Income</a></li>
              <li><a href="#why-matters">Why Income Stability Matters</a></li>
              <li><a href="#learn">Learn</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About RunPayway</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Use</a></li>
              <li><a href="#accessibility">Accessibility</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 RunPayway™. All rights reserved.</p>
          <p>RunPayway™ is a product of PeopleStar Enterprises, INC.</p>
          <p>Orange County, California, USA.</p>
          <p>Structural Stability Model RP-2.0.</p>
          <p>Accessibility: WCAG 2.1 AA Compliant</p>
        </div>
      </footer>
    </div>
  );
}
