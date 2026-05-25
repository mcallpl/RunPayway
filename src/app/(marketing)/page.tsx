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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="5" width="14" height="14" rx="1" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="15" y="7" width="2" height="2" />
      <rect x="7" y="15" width="2" height="2" />
      <rect x="15" y="15" width="2" height="2" />
    </svg>
  );

  const TargetIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  );

  const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '160px',
        paddingBottom: '120px',
        paddingLeft: '48px',
        paddingRight: '48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '120px',
        alignItems: 'flex-start',
      }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* H1 - Doctrine Headline */}
          <h1 style={{
            fontFamily: 'Cormorant Garamond, Garamond, serif',
            fontSize: '72px',
            lineHeight: '88px',
            letterSpacing: '-0.03em',
            fontWeight: 400,
            color: '#0E1A2B',
            margin: '0 0 20px 0',
            maxWidth: '580px',
          }}>
            Income and income stability are not the same thing.
          </h1>

          {/* Supporting Copy */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '28px',
            fontWeight: 400,
            color: '#111827',
            margin: '0 0 32px 0',
            maxWidth: '520px',
          }}>
            RunPayway™ shows whether your income is actually stable.
          </p>

          {/* CTA Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <button style={{
              height: '56px',
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
              justifyContent: 'center',
              gap: '8px',
            }}>
              Check My Income Stability
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
            <button style={{
              height: '56px',
              paddingLeft: '32px',
              paddingRight: '32px',
              backgroundColor: 'transparent',
              color: '#0E1A2B',
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
              How It Works
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
          </div>

          {/* Supporting Line */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '14px',
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
          paddingTop: '64px',
          paddingLeft: '64px',
          paddingRight: '64px',
          paddingBottom: '64px',
        }}>
          {/* Profile Title */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 44px 0',
            textAlign: 'center',
          }}>
            STRUCTURAL STABILITY PROFILE™
          </p>

          {/* Score Section */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#6B7280',
              margin: '0 0 16px 0',
            }}>
              INCOME STABILITY SCORE™
            </p>

            <div style={{
              fontSize: '80px',
              lineHeight: '1',
              fontWeight: 700,
              color: '#0E1A2B',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontVariantNumeric: 'tabular-nums',
            }}>
              72
            </div>

            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0 0 16px 0',
            }}>
              ESTABLISHED STABILITY
            </p>

            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '14px',
              lineHeight: '26px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 32px 0',
            }}>
              Income currently appears stable, though some conditions may weaken income reliability over time.
            </p>
          </div>

          {/* Condition Grid */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '32px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px 48px',
            marginBottom: '32px',
          }}>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6B7280',
                margin: '0 0 8px 0',
              }}>
                MONTHLY INCOME CONSISTENCY
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                MODERATE
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6B7280',
                margin: '0 0 8px 0',
              }}>
                SOURCE DEPENDENCE
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                MANAGEABLE
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6B7280',
                margin: '0 0 8px 0',
              }}>
                RECURRING INCOME
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                STRONG
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6B7280',
                margin: '0 0 8px 0',
              }}>
                INCOME RELIABILITY PRESSURE
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                ELEVATED
              </p>
            </div>
          </div>

          {/* Model Info */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '32px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '32px',
            textAlign: 'center',
          }}>
            <div style={{ borderRight: '1px solid #E5E7EB', paddingRight: '16px' }}>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
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
            <div style={{ borderRight: '1px solid #E5E7EB', paddingRight: '16px', paddingLeft: '16px' }}>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
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
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                Same structure produces same result
              </p>
            </div>
            <div style={{ paddingLeft: '16px' }}>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '11px',
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
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '180px',
        paddingBottom: '180px',
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
          color: '#0E1A2B',
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
            <div key={index} style={{
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
      <section style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        paddingTop: '80px',
        paddingBottom: '80px',
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            paddingRight: '40px',
            borderRight: '1px solid #E5E7EB',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0E1A2B',
            }}>
              <BlueprintIcon />
            </div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
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
            gap: '24px',
            paddingLeft: '40px',
            paddingRight: '40px',
            borderRight: '1px solid #E5E7EB',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0E1A2B',
            }}>
              <TargetIcon />
            </div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
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
            gap: '24px',
            paddingLeft: '40px',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0E1A2B',
            }}>
              <ShieldIcon />
            </div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0',
              textAlign: 'center',
            }}>
              PRIVATE BY DEFAULT
            </p>
          </div>
        </div>
      </section>

      {/* MEMETIC TRUTH SECTION */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '240px',
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
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '160px',
        paddingBottom: '180px',
        paddingLeft: '48px',
        paddingRight: '48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '120px',
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
            margin: '0 0 56px 0',
          }}>
            SAME INCOME. DIFFERENT STABILITY.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '56px',
          }}>
            {/* Profile A */}
            <div style={{
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

          <p style={{
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
      <section style={{
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
              margin: '0 0 24px 0',
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
              margin: '0 0 16px 0',
            }}>
              Including:
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
      <section style={{
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
      <section style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        paddingTop: '180px',
        paddingBottom: '180px',
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

          <div style={{
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
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '180px',
        paddingBottom: '180px',
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
            fontSize: '14px',
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
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '240px',
        paddingBottom: '240px',
        paddingLeft: '48px',
        paddingRight: '48px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, Garamond, serif',
          fontSize: '72px',
          lineHeight: '88px',
          letterSpacing: '-0.03em',
          fontWeight: 400,
          color: '#0E1A2B',
          margin: '0 0 24px 0',
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
          color: '#4B5563',
          margin: '0 0 56px 0',
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
        paddingTop: '160px',
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
                color: '#6B7280',
                margin: '0',
              }}>
                INCOME STABILITY VERIFICATION™
              </p>
            </div>

            {/* Links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '80px',
            }}>
              <div style={{
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
