'use client';

import React from 'react';

export default function LandingPage() {
  // Icon Components
  const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M 6 20 Q 6 15 12 15 Q 18 15 18 20" />
    </svg>
  );

  const TrendIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="4 18 8 10 13 15 20 5" />
      <path d="M 20 5 L 20 8 L 17 8" />
    </svg>
  );

  const BuildingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="4" width="12" height="16" />
      <line x1="10" y1="8" x2="14" y2="8" />
      <line x1="10" y1="12" x2="14" y2="12" />
      <line x1="10" y1="16" x2="14" y2="16" />
    </svg>
  );

  const GearIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M 12 2 L 13 6 L 17 7 L 14 10 L 15 14 L 12 12 L 9 14 L 10 10 L 7 7 L 11 6 Z" />
    </svg>
  );

  const ChartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="18" x2="4" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <rect x="6" y="12" width="3" height="6" />
      <rect x="11" y="8" width="3" height="10" />
      <rect x="16" y="10" width="3" height="8" />
    </svg>
  );

  const LockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="10" width="12" height="9" rx="1" />
      <path d="M 8 10 V 6 Q 8 4 10 4 L 14 4 Q 16 4 16 6 V 10" />
      <line x1="12" y1="14" x2="12" y2="17" />
    </svg>
  );

  const BlueprintIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="5" y="5" width="14" height="14" rx="1" />
      <rect x="8" y="8" width="1.5" height="1.5" />
      <rect x="14.5" y="8" width="1.5" height="1.5" />
      <rect x="8" y="14.5" width="1.5" height="1.5" />
      <rect x="14.5" y="14.5" width="1.5" height="1.5" />
    </svg>
  );

  const TargetIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );

  const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M 12 2 L 20 6 L 20 13 Q 20 18 12 22 Q 4 18 4 13 L 4 6 Z" />
    </svg>
  );

  const LineChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="4 18 8 10 13 15 20 5" />
    </svg>
  );

  const DocumentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="2" width="12" height="20" rx="1" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );

  const PeopleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="7" r="2.5" />
      <circle cx="16" cy="7" r="2.5" />
      <path d="M 5 10 Q 5 12 8 12 L 12 12" />
      <path d="M 13 12 L 16 12 Q 19 12 19 10" />
      <path d="M 4 18 L 4 15 Q 4 13 8 13 Q 12 13 12 15 L 12 18" />
      <path d="M 12 18 L 12 15 Q 12 13 16 13 Q 20 13 20 15 L 20 18" />
    </svg>
  );

  return (
    <div style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
      <style>{`
        @media (max-width: 768px) {
          * {
            box-sizing: border-box;
          }

          header {
            height: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          header img {
            height: 48px !important;
          }

          nav {
            display: none !important;
          }

          header button {
            height: 48px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
            font-size: 11px !important;
            gap: 6px !important;
          }

          /* HERO MOBILE - FINAL POLISH */
          [data-section="hero"] {
            padding-top: 56px !important;
            padding-bottom: 64px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }

          [data-section="hero"] h1 {
            font-size: 48px !important;
            line-height: 56px !important;
            margin-bottom: 14px !important;
            max-width: 100% !important;
          }

          [data-section="hero"] > div:first-child p:first-of-type {
            font-size: 17px !important;
            line-height: 30px !important;
            margin-bottom: 28px !important;
          }

          [data-section="hero"] [data-buttons] {
            flex-direction: column !important;
            gap: 12px !important;
            margin-bottom: 20px !important;
          }

          [data-section="hero"] button {
            height: 52px !important;
            width: 100% !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
            font-size: 12px !important;
          }

          [data-section="hero"] [data-support-line] {
            font-size: 12px !important;
          }

          [data-section="hero"] > div:last-child {
            padding-top: 52px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-bottom: 52px !important;
          }

          [data-section="hero"] > div:last-child p:first-child {
            margin-bottom: 36px !important;
          }

          [data-section="hero"] [data-score] {
            font-size: 64px !important;
            margin-bottom: 14px !important;
          }

          [data-section="hero"] [data-established] {
            font-size: 12px !important;
            margin-bottom: 12px !important;
          }

          [data-section="hero"] [data-description] {
            font-size: 13px !important;
            line-height: 24px !important;
            margin-bottom: 28px !important;
          }

          [data-section="hero"] [data-condition-grid] {
            padding-top: 28px !important;
            gap: 20px 28px !important;
            margin-bottom: 28px !important;
          }

          [data-section="hero"] [data-model-info] {
            padding-top: 28px !important;
            gap: 20px !important;
            grid-template-columns: 1fr !important;
          }

          [data-section="hero"] [data-model-info] > div {
            border-right: none !important;
            border-bottom: 1px solid #E5E7EB !important;
            padding-right: 0 !important;
            padding-left: 0 !important;
            padding-bottom: 20px !important;
          }

          [data-section="hero"] [data-model-info] > div:last-child {
            border-bottom: none !important;
          }

          /* COMMON CONDITIONS MOBILE */
          [data-section="conditions"] {
            padding-top: 100px !important;
            padding-bottom: 100px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
            border-top: 1px solid #E5E7EB !important;
          }

          [data-section="conditions"] p:first-child {
            font-size: 10px !important;
            color: #9CA3AF !important;
            margin-bottom: 56px !important;
          }

          [data-section="conditions"] [data-condition-item] {
            gap: 16px !important;
            padding-top: 20px !important;
            padding-bottom: 20px !important;
          }

          [data-section="conditions"] h3 {
            font-size: 36px !important;
            line-height: 44px !important;
            margin-top: 40px !important;
          }

          /* TRUST STRIP MOBILE */
          [data-section="trust"] {
            padding-top: 60px !important;
            padding-bottom: 60px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          [data-section="trust"] > div {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }

          [data-section="trust"] > div > div {
            border-right: none !important;
            border-bottom: 1px solid #E5E7EB !important;
            padding-right: 0 !important;
            padding-bottom: 32px !important;
          }

          [data-section="trust"] > div > div:last-child {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }

          /* MEMETIC TRUTH MOBILE */
          [data-section="memetic"] {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          [data-section="memetic"] h2 {
            font-size: 40px !important;
            line-height: 48px !important;
            max-width: 100% !important;
          }

          [data-section="memetic"] p {
            font-size: 15px !important;
            line-height: 26px !important;
          }

          /* MODERN INCOME MOBILE */
          [data-section="modern"] {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }

          [data-section="modern"] h3 {
            font-size: 36px !important;
            line-height: 44px !important;
            max-width: 100% !important;
          }

          [data-section="modern"] [data-comparison] {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }

          [data-section="modern"] [data-profile] {
            padding-right: 0 !important;
            border-right: none !important;
            border-bottom: 1px solid #E5E7EB !important;
            padding-bottom: 32px !important;
          }

          [data-section="modern"] [data-profile]:last-child {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }

          [data-section="modern"] [data-compare-text] {
            padding-top: 32px !important;
            border-top: 1px solid #E5E7EB !important;
          }

          /* EVALUATES MOBILE */
          [data-section="evaluates"] {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          [data-section="evaluates"] > div {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }

          [data-section="evaluates"] > div > div {
            padding-right: 0 !important;
            border-right: none !important;
            border-bottom: 1px solid #E5E7EB !important;
            padding-bottom: 32px !important;
          }

          [data-section="evaluates"] > div > div:last-child {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }

          [data-section="evaluates"] button {
            width: 100% !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          /* PROFESSIONAL MOBILE */
          [data-section="professional"] {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          [data-section="professional"] > div {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }

          [data-section="professional"] button {
            width: 100% !important;
          }

          /* FRAMEWORK MOBILE */
          [data-section="framework"] {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          [data-section="framework"] [data-framework-grid] {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            margin-bottom: 56px !important;
          }

          [data-section="framework"] [data-framework-grid] > div {
            padding-right: 0 !important;
            border-right: none !important;
            padding-left: 0 !important;
          }

          [data-section="framework"] h3 {
            font-size: 32px !important;
            line-height: 40px !important;
          }

          /* NOTICE MOBILE */
          [data-section="notice"] {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          /* FINAL CTA MOBILE */
          [data-section="final-cta"] {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          [data-section="final-cta"] h2 {
            font-size: 40px !important;
            line-height: 48px !important;
          }

          [data-section="final-cta"] p {
            font-size: 15px !important;
            line-height: 26px !important;
          }

          [data-section="final-cta"] button {
            width: 100% !important;
          }

          /* FOOTER MOBILE */
          footer {
            padding-top: 100px !important;
            padding-bottom: 80px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          footer > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            margin-bottom: 80px !important;
          }

          footer [data-links] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }

          footer [data-link-section] {
            padding-right: 0 !important;
            border-right: none !important;
            padding-left: 0 !important;
          }

          footer [data-link-section] p:first-child {
            color: #6B7280 !important;
            font-size: 11px !important;
          }
        }
      `}</style>
      {/* HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        height: '104px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '48px',
        paddingRight: '48px',
      }}>
        <div style={{
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <a href="/" style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '80px',
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            <img src="/rplogo.png" alt="RunPayway™" style={{
              height: '64px',
              width: 'auto',
            }} />
          </a>

          {/* Center Navigation */}
          <nav style={{
            display: 'flex',
            gap: '48px',
            alignItems: 'center',
            flex: 1,
          }}>
            {['How It Works', 'Use Cases', 'Verification Environments', 'Learn', 'Methodology'].map((item) => (
              <a key={item} href="#" style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: '#0E1A2B',
                textDecoration: 'none',
                cursor: 'pointer',
              }}>
                {item}
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          <button style={{
            height: '60px',
            paddingLeft: '32px',
            paddingRight: '32px',
            backgroundColor: '#0E1A2B',
            color: '#FFFFFF',
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            border: '1px solid #0E1A2B',
            borderRadius: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: 'auto',
          }}>
            Check My Income Stability
            <span style={{ fontSize: '14px' }}>→</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section data-section="hero" style={{
        maxWidth: '1360px',
        margin: '0 auto',
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '48px',
        paddingRight: '48px',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1.3fr',
        gap: '48px',
        alignItems: 'flex-start',
      }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* H1 - Doctrine Headline */}
          <h1 style={{
            fontFamily: 'Cormorant Garamond, Garamond, serif',
            fontSize: '54px',
            lineHeight: '70px',
            letterSpacing: '-0.02em',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#0E1A2B',
            margin: '0 0 24px 0',
          }}>
            Income and income stability are not the same thing.
          </h1>

          {/* Supporting Copy */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '15px',
            lineHeight: '26px',
            fontWeight: 400,
            color: '#374151',
            margin: '0 0 28px 0',
            maxWidth: '100%',
          }}>
            RunPayway™ shows whether your income is actually stable.
          </p>

          {/* CTA Row */}
          <div data-buttons style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <button style={{
              height: '48px',
              paddingLeft: '28px',
              paddingRight: '28px',
              backgroundColor: '#0E1A2B',
              color: '#FFFFFF',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              border: '1px solid #0E1A2B',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              Check My Income Stability
              <span style={{ fontSize: '13px' }}>→</span>
            </button>
            <button style={{
              height: '48px',
              paddingLeft: '28px',
              paddingRight: '28px',
              backgroundColor: 'transparent',
              color: '#0E1A2B',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              border: '1px solid #0E1A2B',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              How It Works
              <span style={{ fontSize: '13px' }}>→</span>
            </button>
          </div>

          {/* Supporting Line */}
          <p data-support-line style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#6B7280',
            margin: '0',
          }}>
            Free initial insight · No documents required
          </p>
        </div>

        {/* RIGHT COLUMN - STRUCTURAL STABILITY PROFILE™ */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          paddingTop: '48px',
          paddingLeft: '48px',
          paddingRight: '48px',
          paddingBottom: '48px',
        }}>
          {/* Profile Title */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#1F2937',
            margin: '0 0 32px 0',
            textAlign: 'center',
          }}>
            STRUCTURAL STABILITY PROFILE™
          </p>

          {/* Score Section */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6B7280',
              margin: '0 0 12px 0',
            }}>
              INCOME STABILITY SCORE™
            </p>

            <div data-score style={{
              fontSize: '80px',
              lineHeight: '1',
              fontWeight: 700,
              color: '#0E1A2B',
              margin: '0 0 16px 0',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontVariantNumeric: 'tabular-nums',
            }}>
              72
            </div>

            <p data-established style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: '#1F2937',
              margin: '0 0 12px 0',
            }}>
              ESTABLISHED STABILITY
            </p>

            <p data-description style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              lineHeight: '22px',
              fontWeight: 400,
              color: '#6B7280',
              margin: '0 0 28px 0',
            }}>
              Income currently appears stable, though some conditions may weaken income reliability over time.
            </p>
          </div>

          {/* Condition Grid - 3 Column Layout */}
          <div data-condition-grid style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr 1fr',
            gap: '0 16px',
            marginBottom: '20px',
            rowGap: '14px',
          }}>
            {/* Row 1 */}
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6B7280',
              margin: '0',
            }}>
              INCOME STABILITY SCORE™
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6B7280',
              margin: '0',
            }}>
              MONTHLY INCOME CONSISTENCY
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0E1A2B',
              margin: '0',
            }}>
              MODERATE
            </p>
            {/* Row 2 */}
            <p style={{ margin: '0' }}></p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6B7280',
              margin: '0',
            }}>
              SOURCE DEPENDENCE
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0E1A2B',
              margin: '0',
            }}>
              MANAGEABLE
            </p>

            {/* Row 3 */}
            <p style={{ margin: '0' }}></p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6B7280',
              margin: '0',
            }}>
              RECURRING INCOME
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0E1A2B',
              margin: '0',
            }}>
              STRONG
            </p>

            {/* Row 4 */}
            <p style={{ margin: '0' }}></p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6B7280',
              margin: '0',
            }}>
              INCOME RELIABILITY PRESSURE
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0E1A2B',
              margin: '0',
            }}>
              ELEVATED
            </p>
          </div>

          {/* Model Info */}
          <div data-model-info style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
            textAlign: 'center',
          }}>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6B7280',
                margin: '0 0 8px 0',
              }}>
                MODEL VERSION
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                RP-2.0
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6B7280',
                margin: '0 0 8px 0',
              }}>
                INTEGRITY
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#4B5563',
                margin: '0',
                lineHeight: '20px',
              }}>
                Same structure produces same result
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6B7280',
                margin: '0 0 8px 0',
              }}>
                FRAMEWORK
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                Fixed Methodology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMON INCOME CONDITIONS */}
      <section data-section="conditions" style={{
        maxWidth: '1320px',
        margin: '0 auto',
        paddingTop: '120px',
        paddingBottom: '120px',
        paddingLeft: '48px',
        paddingRight: '48px',
        borderTop: '1px solid #E5E7EB',
      }}>
        <p style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#9CA3AF',
          margin: '0 0 56px 0',
        }}>
          COMMON INCOME CONDITIONS
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>
          {[
            { condition: 'most income depends on a single client, customer, employer, or source', Icon: UserIcon },
            { condition: 'income changes significantly from month to month', Icon: TrendIcon },
            { condition: 'income slows quickly when work slows down', Icon: BuildingIcon },
            { condition: 'financial obligations continue growing while income remains variable', Icon: GearIcon },
            { condition: 'future income becomes harder to predict with confidence', Icon: ChartIcon },
            { condition: 'limited backup income exists if current income changes unexpectedly', Icon: LockIcon },
          ].map((item, index) => (
            <div key={index} data-condition-item style={{
              display: 'flex',
              gap: '24px',
              paddingTop: index === 0 ? '0' : '32px',
              paddingBottom: '32px',
              borderBottom: '1px solid #E5E7EB',
              alignItems: 'flex-start',
            }}>
              <div style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0E1A2B',
              }}>
                <item.Icon />
              </div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '15px',
                lineHeight: '26px',
                fontWeight: 400,
                color: '#4B5563',
                margin: '0',
                flex: 1,
              }}>
                {item.condition}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: 'Cormorant Garamond, Garamond, serif',
          fontSize: '48px',
          lineHeight: '60px',
          letterSpacing: '-0.02em',
          fontWeight: 400,
          color: '#0E1A2B',
          margin: '64px 0 0 0',
          maxWidth: '600px',
        }}>
          Income can appear stable until conditions change.
        </p>
      </section>

      {/* TRUST STRIP */}
      <section data-section="trust" style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        paddingTop: '60px',
        paddingBottom: '60px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '48px',
          paddingRight: '48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '60px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            paddingRight: '40px',
            borderRight: 'none',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
            }}>
              <BlueprintIcon />
            </div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#9CA3AF',
              margin: '0',
              textAlign: 'center',
            }}>
              FIXED METHODOLOGY
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            paddingLeft: '40px',
            paddingRight: '40px',
            borderRight: 'none',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
            }}>
              <TargetIcon />
            </div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#9CA3AF',
              margin: '0',
              textAlign: 'center',
            }}>
              CONSISTENT RESULTS
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            paddingLeft: '40px',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
            }}>
              <ShieldIcon />
            </div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#9CA3AF',
              margin: '0',
              textAlign: 'center',
            }}>
              PRIVATE BY DEFAULT
            </p>
          </div>
        </div>
      </section>

      {/* MEMETIC TRUTH SECTION */}
      <section data-section="memetic" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '160px',
        paddingBottom: '160px',
        paddingLeft: '48px',
        paddingRight: '48px',
      }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, Garamond, serif',
          fontSize: '72px',
          lineHeight: '88px',
          letterSpacing: '-0.03em',
          fontWeight: 400,
          color: '#0E1A2B',
          margin: '0 0 40px 0',
          textAlign: 'center',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          High income does not always mean dependable income.
        </h2>
        <p style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '16px',
          lineHeight: '28px',
          fontWeight: 400,
          color: '#4B5563',
          margin: '0',
          textAlign: 'center',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Two people earning the same income can have very different levels of income stability.
        </p>
      </section>

      {/* MODERN INCOME CHANGED SECTION */}
      <section data-section="modern" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '120px',
        paddingBottom: '120px',
        paddingLeft: '48px',
        paddingRight: '48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '100px',
        alignItems: 'flex-start',
      }}>
        {/* LEFT */}
        <div>
          <h3 style={{
            fontFamily: 'Cormorant Garamond, Garamond, serif',
            fontSize: '48px',
            lineHeight: '60px',
            letterSpacing: '-0.02em',
            fontWeight: 400,
            color: '#0E1A2B',
            margin: '0 0 48px 0',
          }}>
            Modern income changed.
          </h3>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '28px',
            fontWeight: 400,
            color: '#4B5563',
            margin: '0 0 24px 0',
          }}>
            More Americans now rely on variable, independent, or non-traditional income than ever before.
          </p>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '28px',
            fontWeight: 400,
            color: '#4B5563',
            margin: '0',
          }}>
            RunPayway™ identifies conditions that may support or weaken income reliability.
          </p>
        </div>

        {/* RIGHT - COMPARISON */}
        <div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 64px 0',
          }}>
            SAME INCOME. DIFFERENT STABILITY.
          </p>

          <div data-comparison style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '56px',
          }}>
            {/* Profile A */}
            <div data-profile style={{
              paddingRight: '32px',
              borderRight: 'none',
            }}>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 24px 0',
              }}>
                PROFILE A
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#0E1A2B',
                margin: '0 0 8px 0',
              }}>
                $150K
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#6B7280',
                margin: '0 0 32px 0',
              }}>
                Annual Income
              </p>
              <ul style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '14px',
                lineHeight: '26px',
                fontWeight: 400,
                color: '#4B5563',
                margin: '0',
                paddingLeft: '0',
                listStyle: 'none',
              }}>
                <li>• most income depends on 1 client</li>
                <li>• income changes month to month</li>
                <li>• no long-term agreements</li>
                <li>• income slows quickly if work slows down</li>
              </ul>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#6B7280',
                margin: '32px 0 0 0',
              }}>
                DEVELOPING STABILITY
              </p>
            </div>

            {/* Profile B */}
            <div data-profile style={{
              paddingLeft: '32px',
              paddingTop: '0',
            }}>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 24px 0',
              }}>
                PROFILE B
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#0E1A2B',
                margin: '0 0 8px 0',
              }}>
                $150K
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#6B7280',
                margin: '0 0 32px 0',
              }}>
                Annual Income
              </p>
              <ul style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '14px',
                lineHeight: '26px',
                fontWeight: 400,
                color: '#4B5563',
                margin: '0',
                paddingLeft: '0',
                listStyle: 'none',
              }}>
                <li>• income comes from multiple sources</li>
                <li>• recurring monthly income</li>
                <li>• lower reliance on any single source</li>
                <li>• income remains steadier over time</li>
              </ul>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#17803D',
                margin: '32px 0 0 0',
              }}>
                ESTABLISHED STABILITY
              </p>
            </div>
          </div>

          <p data-compare-text style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '28px',
            fontWeight: 400,
            color: '#4B5563',
            margin: '56px 0 0 0',
            paddingTop: '56px',
            borderTop: '1px solid #E5E7EB',
          }}>
            Income amount alone does not determine income stability.
          </p>
        </div>
      </section>

      {/* WHAT RUNPAYWAY EVALUATES - THREE COLUMN WITH ICONS */}
      <section data-section="evaluates" style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        paddingTop: '160px',
        paddingBottom: '160px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '48px',
          paddingRight: '48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '80px',
        }}>
          {/* What RunPayway Evaluates */}
          <div style={{
            paddingRight: '40px',
            borderRight: '1px solid #E5E7EB',
          }}>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0 0 40px 0',
            }}>
              WHAT RUNPAYWAY EVALUATES
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '16px',
              lineHeight: '28px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 32px 0',
            }}>
              RunPayway™ evaluates patterns associated with income reliability over time.
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0 0 24px 0',
            }}>
              Including:
            </p>
            <ul style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '14px',
              lineHeight: '32px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 40px 0',
              paddingLeft: '0',
              listStyle: 'none',
            }}>
              <li>• source dependence</li>
              <li>• monthly income consistency</li>
              <li>• reliance on continued activity</li>
              <li>• recurring income behavior</li>
            </ul>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0',
            }}>
              Evaluated using a fixed, repeatable methodology.
            </p>
          </div>

          {/* Free Income Stability Insight */}
          <div style={{
            paddingLeft: '32px',
            paddingRight: '32px',
            borderRight: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0E1A2B',
              marginBottom: '32px',
            }}>
              <LineChartIcon />
            </div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0 0 32px 0',
            }}>
              FREE INCOME STABILITY INSIGHT
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '16px',
              lineHeight: '28px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 48px 0',
              flex: 1,
            }}>
              See how stable your income appears today.
            </p>
            <button style={{
              height: '52px',
              backgroundColor: '#0E1A2B',
              color: '#FFFFFF',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              border: '1px solid #0E1A2B',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              Start Free Insight
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
          </div>

          {/* Full Stability Report */}
          <div style={{
            paddingLeft: '32px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0E1A2B',
              marginBottom: '32px',
            }}>
              <DocumentIcon />
            </div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0 0 32px 0',
            }}>
              FULL STABILITY REPORT
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '48px',
              fontWeight: 700,
              color: '#0E1A2B',
              margin: '0 0 12px 0',
              lineHeight: '1',
            }}>
              $69
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '16px',
              lineHeight: '28px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 32px 0',
              flex: 1,
            }}>
              Identify conditions that may strengthen or weaken income reliability.
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0 0 16px 0',
            }}>
              Includes:
            </p>
            <ul style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '14px',
              lineHeight: '26px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 32px 0',
              paddingLeft: '0',
              listStyle: 'none',
            }}>
              <li>✓ Income Stability Score™</li>
              <li>✓ Stability Scenario Analysis™</li>
              <li>✓ Income Reliability Signals</li>
              <li>✓ Industry Context</li>
              <li>✓ Highest-Impact Stability Opportunities</li>
            </ul>
            <button style={{
              height: '52px',
              backgroundColor: '#0E1A2B',
              color: '#FFFFFF',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              border: '1px solid #0E1A2B',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              Unlock Full Report
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL REVIEW ENVIRONMENTS */}
      <section data-section="professional" style={{
        backgroundColor: '#FFFFFF',
        paddingTop: '160px',
        paddingBottom: '160px',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '48px',
          paddingRight: '48px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '80px',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0E1A2B',
            flexShrink: 0,
          }}>
            <PeopleIcon />
          </div>
          <div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0 0 24px 0',
            }}>
              PROFESSIONAL REVIEW ENVIRONMENTS
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '16px',
              lineHeight: '28px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 24px 0',
              maxWidth: '600px',
            }}>
              RunPayway™ also supports professional review environments for client and operational income evaluations.
            </p>
            <button style={{
              height: '52px',
              paddingLeft: '28px',
              paddingRight: '28px',
              backgroundColor: '#0E1A2B',
              color: '#FFFFFF',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              border: '1px solid #0E1A2B',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              Explore Professional Verification
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* FRAMEWORK STANDARD */}
      <section data-section="framework" style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        paddingTop: '160px',
        paddingBottom: '160px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '48px',
          paddingRight: '48px',
        }}>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 80px 0',
            textAlign: 'center',
          }}>
            FRAMEWORK STANDARD
          </p>

          <div data-framework-grid style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '56px',
            marginBottom: '80px',
          }}>
            <div style={{
              paddingRight: '40px',
              borderRight: '1px solid #E5E7EB',
            }}>
              <p style={{
                fontFamily: 'Cormorant Garamond, Garamond, serif',
                fontSize: '40px',
                lineHeight: '52px',
                letterSpacing: '-0.02em',
                fontWeight: 400,
                color: '#0E1A2B',
                margin: '0',
              }}>
                Fixed rules.
              </p>
            </div>
            <div style={{
              paddingLeft: '40px',
              paddingRight: '40px',
              borderRight: '1px solid #E5E7EB',
            }}>
              <p style={{
                fontFamily: 'Cormorant Garamond, Garamond, serif',
                fontSize: '40px',
                lineHeight: '52px',
                letterSpacing: '-0.02em',
                fontWeight: 400,
                color: '#0E1A2B',
                margin: '0',
              }}>
                Deterministic results.
              </p>
            </div>
            <div style={{
              paddingLeft: '40px',
            }}>
              <p style={{
                fontFamily: 'Cormorant Garamond, Garamond, serif',
                fontSize: '40px',
                lineHeight: '52px',
                letterSpacing: '-0.02em',
                fontWeight: 400,
                color: '#0E1A2B',
                margin: '0',
              }}>
                Version-locked methodology.
              </p>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '80px',
            paddingBottom: '80px',
            borderBottom: '1px solid #E5E7EB',
          }}>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '16px',
              lineHeight: '28px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 24px 0',
            }}>
              RunPayway™ applies the same methodology across all verification environments.
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '16px',
              lineHeight: '28px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0',
            }}>
              Identical structures produce identical outcomes.
            </p>
          </div>

          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0',
            textAlign: 'center',
          }}>
            STRUCTURAL STABILITY MODEL RP-2.0
          </p>
        </div>
      </section>

      {/* STRUCTURAL EVALUATION NOTICE */}
      <section data-section="notice" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '120px',
        paddingBottom: '120px',
        paddingLeft: '48px',
        paddingRight: '48px',
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
            flexShrink: 0,
            paddingTop: '2px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '15px',
            lineHeight: '28px',
            fontWeight: 400,
            color: '#4B5563',
            margin: '0',
            maxWidth: '900px',
          }}>
            RunPayway™ evaluates income stability conditions using a fixed methodological framework. Results are informational and are not financial, legal, tax, lending, insurance, investment, or employment advice. RunPayway™ does not guarantee future outcomes or replace professional judgment.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-section="final-cta" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '160px',
        paddingBottom: '160px',
        paddingLeft: '48px',
        paddingRight: '48px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, Garamond, serif',
          fontSize: '80px',
          lineHeight: '96px',
          letterSpacing: '-0.03em',
          fontWeight: 400,
          color: '#0E1A2B',
          margin: '0 0 32px 0',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Check how stable your income is.
        </h2>
        <p style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '16px',
          lineHeight: '28px',
          fontWeight: 400,
          color: '#6B7280',
          margin: '0 0 80px 0',
        }}>
          Complete your insight in under 2 minutes.
        </p>
        <button style={{
          height: '52px',
          paddingLeft: '28px',
          paddingRight: '28px',
          backgroundColor: '#0E1A2B',
          color: '#FFFFFF',
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          border: '1px solid #0E1A2B',
          borderRadius: '2px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px',
        }}>
          Check My Income Stability
          <span style={{ fontSize: '14px' }}>→</span>
        </button>
        <p style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          color: '#6B7280',
          margin: '0',
        }}>
          Free initial insight · No documents required
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        paddingTop: '120px',
        paddingBottom: '80px',
        paddingLeft: '48px',
        paddingRight: '48px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          {/* Footer Top */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '160px',
            marginBottom: '80px',
            alignItems: 'flex-start',
          }}>
            {/* Logo & Tagline */}
            <div style={{ flexShrink: 0 }}>
              <img src="/rplogo.png" alt="RunPayway™" style={{
                height: '40px',
                width: 'auto',
                marginBottom: '16px',
              }} />
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#9CA3AF',
                margin: '0',
              }}>
                INCOME STABILITY VERIFICATION™
              </p>
            </div>

            {/* Links */}
            <div data-links style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '80px',
            }}>
              <div data-link-section style={{
                paddingRight: '32px',
                borderRight: '1px solid #E5E7EB',
              }}>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  margin: '0 0 20px 0',
                }}>
                  How It Works
                </p>
                <ul style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: '#4B5563',
                  margin: '0',
                  paddingLeft: '0',
                  listStyle: 'none',
                }}>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Use Cases</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Verification Environments</a></li>
                </ul>
              </div>
              <div data-link-section style={{
                paddingLeft: '32px',
                paddingRight: '32px',
                borderRight: '1px solid #E5E7EB',
              }}>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 24px 0',
                }}>
                  Learn
                </p>
                <ul style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: '#4B5563',
                  margin: '0',
                  paddingLeft: '0',
                  listStyle: 'none',
                }}>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Learn</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Contact</a></li>
                </ul>
              </div>
              <div style={{
                paddingLeft: '32px',
                paddingRight: '32px',
                borderRight: '1px solid #E5E7EB',
              }}>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 24px 0',
                }}>
                  Legal
                </p>
                <ul style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: '#4B5563',
                  margin: '0',
                  paddingLeft: '0',
                  listStyle: 'none',
                }}>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Privacy Policy</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Terms</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Accessibility</a></li>
                </ul>
              </div>
              <div style={{
                paddingLeft: '32px',
              }}>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 24px 0',
                }}>
                  System Integrity
                </p>
                <ul style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: '#4B5563',
                  margin: '0',
                  paddingLeft: '0',
                  listStyle: 'none',
                }}>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Methodology</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Data Security</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '56px',
          }}>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '12px',
              lineHeight: '20px',
              fontWeight: 400,
              color: '#6B7280',
              margin: '0',
            }}>
              © 2026 RunPayway™. All rights reserved.<br />
              RunPayway™ is a product of PeopleStar Enterprises, INC.<br />
              Orange County, California, USA.<br />
              Structural Stability Model RP-2.0.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
