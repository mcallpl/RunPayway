'use client';

import React from 'react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", backgroundColor: '#FFFFFF', color: '#0E1A2B' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; }

        /* HEADER */
        .rp-header {
          position: sticky;
          top: 0;
          height: 80px;
          background: white;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          z-index: 100;
          padding: 0 48px;
        }

        .rp-header-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rp-logo { height: 40px; }

        .rp-nav {
          display: none;
          gap: 48px;
          flex: 1;
          margin-left: 80px;
        }

        @media (min-width: 1024px) {
          .rp-nav { display: flex; }
        }

        .rp-nav a {
          font-size: 14px;
          font-weight: 500;
          color: #0E1A2B;
          text-decoration: none;
          cursor: pointer;
        }

        .rp-header-right {
          display: flex;
          gap: 24px;
          align-items: center;
          margin-left: auto;
        }

        .rp-sign-in {
          font-size: 14px;
          font-weight: 600;
          color: #4B3FAE;
          text-decoration: none;
          display: none;
        }

        @media (min-width: 1024px) {
          .rp-sign-in { display: block; }
        }

        .rp-btn-primary {
          background: #4B3FAE;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .rp-btn-primary:hover { opacity: 0.9; }

        /* HERO SECTION */
        .rp-hero {
          padding: 120px 48px;
          max-width: 1280px;
          margin: 0 auto;
        }

        @media (max-width: 1023px) {
          .rp-hero { padding: 80px 20px; }
          .rp-header { padding: 0 20px; }
        }

        @media (max-width: 768px) {
          .rp-hero { padding: 64px 20px; }
        }

        .rp-hero-grid {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 80px;
          align-items: center;
        }

        @media (max-width: 1023px) {
          .rp-hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        @media (max-width: 768px) {
          .rp-hero-grid {
            gap: 32px;
          }
        }

        .rp-hero-left h1 {
          font-size: 56px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 32px;
          color: #0E1A2B;
        }

        @media (max-width: 1023px) {
          .rp-hero-left h1 { font-size: 48px; margin-bottom: 28px; }
        }

        @media (max-width: 768px) {
          .rp-hero-left h1 { font-size: 40px; }
        }

        .rp-hero-left p {
          font-size: 18px;
          font-weight: 400;
          line-height: 1.6;
          margin-bottom: 40px;
          color: #0E1A2B;
        }

        @media (max-width: 768px) {
          .rp-hero-left p { font-size: 16px; margin-bottom: 32px; }
        }

        .rp-hero-cta {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 32px;
        }

        .rp-btn-hero {
          background: #4B3FAE;
          color: white;
          border: none;
          padding: 16px 36px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
          transition: opacity 0.2s;
        }

        .rp-btn-hero:hover { opacity: 0.9; }

        .rp-microcopy {
          font-size: 14px;
          font-weight: 400;
          color: #6B7280;
        }

        /* REPORT CARD */
        .rp-report {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 48px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 768px) {
          .rp-report { padding: 36px; }
        }

        .rp-report-score {
          font-size: 80px;
          font-weight: 700;
          color: #0E1A2B;
          margin: 0 0 12px 0;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .rp-report-score { font-size: 64px; }
        }

        .rp-report-label {
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
          margin-bottom: 32px;
        }

        .rp-report-class {
          font-size: 20px;
          font-weight: 700;
          color: #0E1A2B;
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid #E5E7EB;
        }

        .rp-drivers {
          margin-bottom: 40px;
        }

        .rp-drivers-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #0E1A2B;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .rp-drivers-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .rp-drivers-list li {
          font-size: 14px;
          font-weight: 400;
          color: #0E1A2B;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .rp-drivers-list li:last-child { margin-bottom: 0; }

        .rp-pressure {
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid #E5E7EB;
        }

        .rp-pressure-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #D32F2F;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .rp-verification {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #0E1A2B;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
        }

        .rp-verification-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          font-size: 12px;
        }

        .rp-verification-item {
          margin-bottom: 12px;
        }

        .rp-verification-label {
          font-weight: 600;
          color: #0E1A2B;
          margin-bottom: 4px;
          font-size: 12px;
        }

        .rp-verification-value {
          color: #6B7280;
          font-size: 12px;
          font-weight: 500;
        }

        .rp-verification-note {
          font-size: 12px;
          color: #6B7280;
          margin-top: 16px;
          text-align: center;
        }

        /* SECTIONS */
        .rp-section {
          padding: 120px 48px;
          max-width: 1280px;
          margin: 0 auto;
        }

        @media (max-width: 1023px) {
          .rp-section { padding: 80px 20px; }
        }

        @media (max-width: 768px) {
          .rp-section { padding: 64px 20px; }
        }

        .rp-section-bg-sand {
          background: #F4F1EA;
        }

        .rp-section-bg-navy {
          background: #0E1A2B;
          color: white;
        }

        .rp-section h2 {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 64px;
          color: inherit;
          text-align: center;
          line-height: 1.3;
        }

        @media (max-width: 1023px) {
          .rp-section h2 { font-size: 32px; margin-bottom: 48px; }
        }

        @media (max-width: 768px) {
          .rp-section h2 { font-size: 28px; margin-bottom: 40px; }
        }

        .rp-comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 48px;
        }

        @media (max-width: 768px) {
          .rp-comparison-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            margin-bottom: 40px;
          }
        }

        .rp-profile-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 40px;
        }

        @media (max-width: 768px) {
          .rp-profile-card { padding: 32px; }
        }

        .rp-profile-header {
          font-size: 14px;
          font-weight: 700;
          color: #4B3FAE;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rp-profile-income {
          font-size: 20px;
          font-weight: 700;
          color: #0E1A2B;
          margin-bottom: 20px;
        }

        .rp-profile-list {
          list-style: none;
          margin: 0 0 32px 0;
          padding: 0;
          font-size: 14px;
          color: #0E1A2B;
          line-height: 1.6;
        }

        .rp-profile-list li {
          margin-bottom: 10px;
        }

        .rp-profile-list li:last-child { margin-bottom: 0; }

        .rp-class-box {
          background: #F4F1EA;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }

        .rp-class-label {
          font-size: 11px;
          font-weight: 600;
          color: #6B7280;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .rp-class-value {
          font-size: 16px;
          font-weight: 700;
          color: #4B3FAE;
          border: 2px solid #4B3FAE;
          border-radius: 6px;
          padding: 10px 20px;
          display: inline-block;
        }

        .rp-key-insight {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 40px;
        }

        @media (max-width: 768px) {
          .rp-key-insight { padding: 32px; }
        }

        .rp-insight-title {
          font-size: 14px;
          font-weight: 700;
          color: #0E1A2B;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rp-insight-text {
          font-size: 16px;
          font-weight: 400;
          color: #0E1A2B;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .rp-insight-link {
          font-size: 14px;
          font-weight: 600;
          color: #4B3FAE;
          text-decoration: none;
          cursor: pointer;
        }

        /* EXAMPLE PROFILE SECTION */
        .rp-example-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: flex-start;
          margin-bottom: 64px;
        }

        @media (max-width: 768px) {
          .rp-example-grid {
            grid-template-columns: 1fr;
            gap: 48px;
            margin-bottom: 48px;
          }
        }

        .rp-large-report {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 48px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 768px) {
          .rp-large-report { padding: 36px; }
        }

        .rp-large-report .rp-report-score {
          font-size: 72px;
        }

        .rp-included-section h3 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #0E1A2B;
        }

        .rp-included-list {
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 14px;
          color: #0E1A2B;
          line-height: 1.7;
        }

        .rp-included-list li {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rp-included-list li:before {
          content: "○";
          color: #4B3FAE;
          font-weight: bold;
          min-width: 16px;
        }

        .rp-view-sample {
          font-size: 14px;
          font-weight: 600;
          color: #4B3FAE;
          text-decoration: none;
          cursor: pointer;
          display: inline-block;
          margin-top: 28px;
          border: 2px solid #4B3FAE;
          padding: 12px 20px;
          border-radius: 6px;
        }

        /* UNDERSTANDING THE REPORT */
        .rp-understanding-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
        }

        @media (max-width: 768px) {
          .rp-understanding-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        .rp-understanding-item h4 {
          font-size: 14px;
          font-weight: 700;
          color: #0E1A2B;
          margin-bottom: 16px;
        }

        .rp-understanding-item p {
          font-size: 14px;
          font-weight: 400;
          color: #0E1A2B;
          line-height: 1.7;
        }

        /* STRUCTURAL MODEL */
        .rp-pillars-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }

        @media (max-width: 768px) {
          .rp-pillars-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-bottom: 40px;
          }
        }

        .rp-pillar {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 40px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .rp-pillar { padding: 32px 24px; }
        }

        .rp-pillar-icon {
          font-size: 40px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rp-pillar-text {
          font-size: 16px;
          font-weight: 700;
          color: #0E1A2B;
        }

        .rp-pillar-description {
          font-size: 14px;
          font-weight: 400;
          color: #6B7280;
          line-height: 1.6;
          margin-top: 8px;
        }

        .rp-methodology-link {
          font-size: 14px;
          font-weight: 600;
          color: #4B3FAE;
          text-decoration: none;
          cursor: pointer;
          display: inline-block;
        }

        /* CENTERPIECE STATEMENT */
        .rp-centerpiece {
          text-align: center;
          padding: 120px 48px;
          font-size: 32px;
          font-weight: 700;
          color: #0E1A2B;
          line-height: 1.4;
        }

        @media (max-width: 1023px) {
          .rp-centerpiece { padding: 80px 20px; font-size: 28px; }
        }

        @media (max-width: 768px) {
          .rp-centerpiece { padding: 64px 20px; font-size: 24px; }
        }

        /* ACCESS YOUR RESULT */
        .rp-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 32px;
        }

        @media (max-width: 1023px) {
          .rp-cards-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .rp-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 40px;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .rp-card { padding: 32px; }
        }

        .rp-card-icon {
          font-size: 40px;
          margin-bottom: 20px;
        }

        .rp-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0E1A2B;
          margin-bottom: 16px;
        }

        .rp-card-desc {
          font-size: 14px;
          font-weight: 400;
          color: #6B7280;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .rp-card-includes {
          font-size: 12px;
          font-weight: 700;
          color: #0E1A2B;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rp-card-list {
          list-style: none;
          margin: 0 0 28px 0;
          padding: 0;
          font-size: 13px;
          color: #0E1A2B;
          line-height: 1.6;
        }

        .rp-card-list li {
          margin-bottom: 8px;
        }

        .rp-card-price {
          font-size: 24px;
          font-weight: 700;
          color: #0E1A2B;
          margin-bottom: 24px;
          margin-top: auto;
        }

        .rp-card-btn {
          background: #4B3FAE;
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }

        .rp-card-btn:hover { opacity: 0.9; }

        .rp-card.result {
          border: 2px solid #4B3FAE;
          box-shadow: 0 4px 12px rgba(75, 63, 174, 0.15);
        }

        /* FOOTER */
        .rp-footer {
          background: #0E1A2B;
          color: white;
          padding: 120px 48px 48px;
        }

        @media (max-width: 768px) {
          .rp-footer { padding: 80px 20px 40px; }
        }

        .rp-footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 80px;
          max-width: 1280px;
          margin: 0 auto 80px;
        }

        @media (max-width: 768px) {
          .rp-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            margin-bottom: 60px;
          }
        }

        .rp-footer-section h4 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 28px;
          letter-spacing: 0.5px;
        }

        .rp-footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .rp-footer-links li {
          margin-bottom: 16px;
        }

        .rp-footer-links a {
          font-size: 13px;
          font-weight: 400;
          color: white;
          text-decoration: none;
          line-height: 1.6;
        }

        .rp-footer-links a:hover { opacity: 0.7; }

        .rp-footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding-top: 48px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .rp-footer-bottom p {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 6px;
          line-height: 1.5;
        }

        .rp-footer-bottom p:last-child { margin-bottom: 0; }

        /* FINAL CTA SECTION SPACING */
        .rp-final-cta {
          padding: 120px 48px;
        }

        @media (max-width: 1023px) {
          .rp-final-cta { padding: 80px 20px; }
        }

        @media (max-width: 768px) {
          .rp-final-cta { padding: 64px 20px; }
        }

        .rp-final-cta h2 {
          margin-bottom: 28px;
        }

        .rp-final-cta-subtitle {
          font-size: 20px;
          font-weight: 500;
          color: white;
          margin-bottom: 40px;
        }

        /* CLARIFICATION SECTION SPACING */
        .rp-clarification {
          padding: 120px 48px;
        }

        @media (max-width: 1023px) {
          .rp-clarification { padding: 80px 20px; }
        }

        @media (max-width: 768px) {
          .rp-clarification { padding: 64px 20px; }
        }

        .rp-clarification p {
          font-size: 13px;
          margin-bottom: 20px;
          line-height: 1.7;
          color: #0E1A2B;
        }

        .rp-clarification p:last-child { margin-bottom: 0; }
      `}</style>

      {/* HEADER */}
      <header className="rp-header">
        <div className="rp-header-container">
          <Image
            src="/RunPayway_Logo.svg"
            alt="RunPayway™"
            width={180}
            height={40}
            className="rp-logo"
            priority
          />
          <nav className="rp-nav">
            <a href="#">How It Works</a>
            <a href="#">Methodology</a>
            <a href="#">Learn</a>
            <a href="#">Solutions</a>
          </nav>
          <div className="rp-header-right">
            <a href="/sign-in" className="rp-sign-in">Sign In</a>
            <button className="rp-btn-primary" onClick={() => window.location.href = '/assessment'}>
              Start Assessment →
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="rp-hero">
        <div className="rp-hero-grid">
          <div className="rp-hero-left">
            <h1>Before relying on income, know its stability.</h1>
            <p>RunPayway™ measures the stability of your income using Structural Stability Model RP-2.0.</p>
            <div className="rp-hero-cta">
              <button className="rp-btn-hero" onClick={() => window.location.href = '/assessment'}>
                Start Assessment →
              </button>
            </div>
            <p className="rp-microcopy">Free • Under 2 Minutes • No Documents Required</p>
          </div>

          <div className="rp-report">
            <p className="rp-report-label">Income Stability Score</p>
            <p className="rp-report-score">72</p>
            <p className="rp-report-label">Income Stability Class</p>
            <p className="rp-report-class">Established Stability</p>

            <div className="rp-drivers">
              <p className="rp-drivers-title">Primary Stability Drivers™</p>
              <ul className="rp-drivers-list">
                <li>• Recurring Income</li>
                <li>• Income Diversification</li>
                <li>• Income Continuity</li>
              </ul>
            </div>

            <div className="rp-pressure">
              <p className="rp-pressure-title">Stability Pressure Factors™</p>
              <ul className="rp-drivers-list">
                <li>• Income Concentration</li>
                <li>• Activity Dependency</li>
              </ul>
            </div>

            <p className="rp-verification">VERIFIED REPORT</p>
            <div className="rp-verification-grid">
              <div className="rp-verification-item">
                <p className="rp-verification-label">Verification Status:</p>
                <p className="rp-verification-value">Verified</p>
              </div>
              <div className="rp-verification-item">
                <p className="rp-verification-label">Report ID:</p>
                <p className="rp-verification-value">RP2-2026-0048127</p>
              </div>
              <div className="rp-verification-item">
                <p className="rp-verification-label">Model Version:</p>
                <p className="rp-verification-value">RP-2.0</p>
              </div>
              <div className="rp-verification-item">
                <p className="rp-verification-label">Generated:</p>
                <p className="rp-verification-value">June 2, 2026</p>
              </div>
            </div>
            <p className="rp-verification-note">Verification Available On All Issued Reports</p>
          </div>
        </div>
      </section>

      {/* SAME INCOME, DIFFERENT STABILITY */}
      <section className="rp-section rp-section-bg-sand">
        <h2>Same Income. Different Stability.</h2>
        <div className="rp-comparison-grid">
          <div className="rp-profile-card">
            <p className="rp-profile-header">PROFILE A</p>
            <p className="rp-profile-income">Income: $150,000</p>
            <ul className="rp-profile-list">
              <li>• One primary client</li>
              <li>• No recurring agreements</li>
              <li>• Income depends on continued activity</li>
            </ul>
            <div className="rp-class-box">
              <p className="rp-class-label">Income Stability Class</p>
              <p className="rp-class-value">Developing Stability</p>
            </div>
          </div>

          <div className="rp-profile-card">
            <p className="rp-profile-header">PROFILE B</p>
            <p className="rp-profile-income">Income: $150,000</p>
            <ul className="rp-profile-list">
              <li>• Multiple income sources</li>
              <li>• Recurring income</li>
              <li>• Lower concentration</li>
              <li>• More consistent income over time</li>
            </ul>
            <div className="rp-class-box">
              <p className="rp-class-label">Income Stability Class</p>
              <p className="rp-class-value">Established Stability</p>
            </div>
          </div>
        </div>

        <div className="rp-key-insight">
          <p className="rp-insight-title">KEY INSIGHT</p>
          <p className="rp-insight-text">Two people earning the same income can receive different Income Stability classifications.</p>
          <a href="#" className="rp-insight-link">Know the stability of your income →</a>
        </div>
      </section>

      {/* EXAMPLE PROFILE & UNDERSTANDING */}
      <section className="rp-section">
        <h2>Example Income Stability Profile</h2>
        <div className="rp-example-grid">
          <div className="rp-large-report">
            <p className="rp-report-label">Income Stability Score</p>
            <p className="rp-report-score">72</p>
            <p className="rp-report-label">Income Stability Class</p>
            <p className="rp-report-class">Established Stability</p>

            <div className="rp-drivers">
              <p className="rp-drivers-title">Primary Stability Drivers™</p>
              <ul className="rp-drivers-list">
                <li>• Recurring Income</li>
                <li>• Income Diversification</li>
                <li>• Income Continuity</li>
              </ul>
            </div>

            <div className="rp-pressure">
              <p className="rp-pressure-title">Stability Pressure Factors™</p>
              <ul className="rp-drivers-list">
                <li>• Income Concentration</li>
                <li>• Activity Dependency</li>
              </ul>
            </div>

            <p className="rp-verification">VERIFIED REPORT</p>
            <div className="rp-verification-grid">
              <div className="rp-verification-item">
                <p className="rp-verification-label">Verification Status:</p>
                <p className="rp-verification-value">Verified</p>
              </div>
              <div className="rp-verification-item">
                <p className="rp-verification-label">Report ID:</p>
                <p className="rp-verification-value">RP2-2026-0048127</p>
              </div>
              <div className="rp-verification-item">
                <p className="rp-verification-label">Model Version:</p>
                <p className="rp-verification-value">RP-2.0</p>
              </div>
              <div className="rp-verification-item">
                <p className="rp-verification-label">Generated:</p>
                <p className="rp-verification-value">June 2, 2026</p>
              </div>
            </div>
            <p className="rp-verification-note">Verification Available On All Issued Reports</p>
          </div>

          <div>
            <div className="rp-included-section">
              <h3>Included In The Report</h3>
              <ul className="rp-included-list">
                <li>Income Stability Measurement</li>
                <li>Income Stability Class</li>
                <li>Income Stability Score</li>
                <li>Primary Stability Drivers™</li>
                <li>Stability Pressure Factors™</li>
                <li>Report Verification</li>
              </ul>
              <a href="/sample-report" className="rp-view-sample">View Sample Report →</a>
            </div>
          </div>
        </div>
      </section>

      {/* UNDERSTANDING THE REPORT */}
      <section className="rp-section rp-section-bg-sand">
        <h2>Understanding The Report</h2>
        <div className="rp-understanding-grid">
          <div className="rp-understanding-item">
            <h4>Income Stability Measurement</h4>
            <p>A standardized measurement of Income Stability.</p>
          </div>
          <div className="rp-understanding-item">
            <h4>Income Stability Class</h4>
            <p>A classification within the Income Stability framework.</p>
          </div>
          <div className="rp-understanding-item">
            <h4>Income Stability Score</h4>
            <p>A standardized score generated using Structural Stability Model RP-2.0.</p>
          </div>
          <div className="rp-understanding-item">
            <h4>Primary Stability Drivers™</h4>
            <p>Characteristics contributing most to the result.</p>
          </div>
          <div className="rp-understanding-item">
            <h4>Stability Pressure Factors™</h4>
            <p>Characteristics placing pressure on the result.</p>
          </div>
          <div className="rp-understanding-item">
            <h4>Report Verification</h4>
            <p>Model version, report identification, and verification details.</p>
          </div>
        </div>
      </section>

      {/* STRUCTURAL STABILITY MODEL */}
      <section className="rp-section">
        <h2>Structural Stability Model RP-2.0</h2>
        <div className="rp-pillars-grid">
          <div className="rp-pillar">
            <div className="rp-pillar-icon">📋</div>
            <p className="rp-pillar-text">Same Inputs</p>
            <p className="rp-pillar-description">No human overrides.</p>
          </div>
          <div className="rp-pillar">
            <div className="rp-pillar-icon">✓</div>
            <p className="rp-pillar-text">Same Methodology</p>
            <p className="rp-pillar-description">No subjective scoring.</p>
          </div>
          <div className="rp-pillar">
            <div className="rp-pillar-icon">📊</div>
            <p className="rp-pillar-text">Same Outputs</p>
            <p className="rp-pillar-description">No changing standards.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="/methodology" className="rp-methodology-link">Learn More About The Methodology →</a>
        </div>
      </section>

      {/* CENTERPIECE */}
      <div className="rp-centerpiece">
        Income Amount And Income Stability<br />Provide Different Information.
      </div>

      {/* ACCESS YOUR RESULT */}
      <section className="rp-section rp-section-bg-sand">
        <h2>Access Your Result</h2>
        <div className="rp-cards-grid">
          <div className="rp-card">
            <div className="rp-card-icon">📋</div>
            <h3>Assessment</h3>
            <p className="rp-card-desc">Begin the measurement process.</p>
            <p className="rp-card-includes">Includes:</p>
            <ul className="rp-card-list">
              <li>• Assessment Completion</li>
              <li>• Income Structure Evaluation</li>
              <li>• Eligibility To Unlock Additional Outputs</li>
            </ul>
            <p className="rp-card-price">FREE</p>
            <button className="rp-card-btn" onClick={() => window.location.href = '/assessment'}>
              Start Assessment →
            </button>
          </div>

          <div className="rp-card result">
            <div className="rp-card-icon">📄</div>
            <h3>Result</h3>
            <p className="rp-card-desc">Receive your Income Stability result.</p>
            <p className="rp-card-includes">Includes:</p>
            <ul className="rp-card-list">
              <li>• Income Stability Measurement</li>
              <li>• Income Stability Class</li>
              <li>• Income Stability Score</li>
            </ul>
            <p className="rp-card-price">$9</p>
            <button className="rp-card-btn" onClick={() => window.location.href = '/assessment'}>
              Reveal My Result →
            </button>
          </div>

          <div className="rp-card">
            <div className="rp-card-icon">📊</div>
            <h3>Analysis</h3>
            <p className="rp-card-desc">Receive the complete Income Stability analysis.</p>
            <p className="rp-card-includes">Includes everything in Result plus:</p>
            <ul className="rp-card-list">
              <li>• Expanded Result Explanation</li>
              <li>• Stability Contributors</li>
              <li>• Stability Pressure Factors™</li>
              <li>• Review Areas</li>
              <li>• Industry Context™</li>
              <li>• Analysis Observations™</li>
            </ul>
            <p className="rp-card-price">$69</p>
            <button className="rp-card-btn" onClick={() => window.location.href = '/assessment'}>
              Understand My Income Stability →
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="rp-section-bg-navy rp-final-cta">
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: 'white' }}>Before relying on income, know its stability.</h2>
          <p className="rp-final-cta-subtitle">Start Your Income Stability Assessment.</p>
          <button className="rp-btn-hero" style={{ background: '#4B3FAE', marginBottom: '28px' }} onClick={() => window.location.href = '/assessment'}>
            Start Assessment →
          </button>
          <p className="rp-microcopy" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Free • Under 2 Minutes • No Documents Required
          </p>
        </div>
      </section>

      {/* SYSTEM CLARIFICATION */}
      <section className="rp-clarification">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p>RunPayway™ measures the stability of your income using Structural Stability Model RP-2.0.</p>
          <p>RunPayway™ is not a credit score, lending decision, investment recommendation, financial plan, employment evaluation, or prediction of future income.</p>
          <p>Results provide a standardized measurement generated from information supplied during the assessment.</p>
          <p>Model Version: RP-2.0</p>
          <p>Verification Available On Issued Reports.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="rp-footer">
        <div className="rp-footer-grid">
          <div className="rp-footer-section">
            <h4>PRODUCT</h4>
            <ul className="rp-footer-links">
              <li><a href="#">Income Stability Assessment</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Methodology</a></li>
              <li><a href="#">Verify Report</a></li>
            </ul>
          </div>
          <div className="rp-footer-section">
            <h4>SOLUTIONS</h4>
            <ul className="rp-footer-links">
              <li><a href="#">Individuals</a></li>
              <li><a href="#">Advisors</a></li>
              <li><a href="#">Organizations</a></li>
            </ul>
          </div>
          <div className="rp-footer-section">
            <h4>LEARN</h4>
            <ul className="rp-footer-links">
              <li><a href="#">What Is Income Stability?</a></li>
              <li><a href="#">Income Stability vs Income</a></li>
              <li><a href="#">Why Income Stability Matters</a></li>
              <li><a href="#">Learn</a></li>
            </ul>
          </div>
          <div className="rp-footer-section">
            <h4>COMPANY</h4>
            <ul className="rp-footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="rp-footer-bottom">
          <p>Income Stability Measurement</p>
          <p>© 2026 RunPayway™. All rights reserved.</p>
          <p>RunPayway™ is a product of PeopleStar Enterprises, LLC.</p>
          <p>Orange County, California, USA.</p>
          <p>Structural Stability Model RP-2.0.</p>
        </div>
      </footer>
    </div>
  );
}
