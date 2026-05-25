'use client';

import React from 'react';

export default function LandingPage() {
  return (
    <div style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
      {/* HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        height: '88px',
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
              height: '48px',
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: 'auto',
          }}>
            CHECK INCOME STABILITY
            <span style={{ fontSize: '14px' }}>→</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '128px',
        paddingBottom: '168px',
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
            fontFamily: 'Garamond, Sabon, Georgia, serif',
            fontSize: '72px',
            lineHeight: '82px',
            letterSpacing: '-0.03em',
            fontWeight: 400,
            color: '#0E1A2B',
            margin: '0 0 40px 0',
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
            color: '#4B5563',
            margin: '0 0 48px 0',
            maxWidth: '520px',
          }}>
            RunPayway™ shows whether your income is actually stable.
          </p>

          {/* CTA Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}>
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              CHECK INCOME STABILITY
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
            <button style={{
              height: '52px',
              paddingLeft: '28px',
              paddingRight: '28px',
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
              HOW IT WORKS
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - STRUCTURAL STABILITY PROFILE™ */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          paddingTop: '56px',
          paddingLeft: '56px',
          paddingRight: '56px',
          paddingBottom: '56px',
        }}>
          {/* Profile Title */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 32px 0',
          }}>
            STRUCTURAL STABILITY PROFILE™
          </p>

          {/* Score Section */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 12px 0',
          }}>
            INCOME STABILITY SCORE™
          </p>

          <div style={{
            fontSize: '84px',
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
            margin: '0 0 32px 0',
          }}>
            ESTABLISHED STABILITY
          </p>

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
                fontSize: '12px',
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
                fontSize: '12px',
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
                fontSize: '12px',
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
                fontSize: '12px',
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
          }}>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
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
                fontSize: '12px',
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
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
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

      {/* TRUST STRIP */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        paddingTop: '48px',
        paddingBottom: '48px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '48px',
          paddingRight: '48px',
          display: 'flex',
          justifyContent: 'center',
          gap: '96px',
          alignItems: 'center',
        }}>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0',
          }}>
            FIXED METHODOLOGY
          </p>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0',
          }}>
            CONSISTENT RESULTS
          </p>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0',
          }}>
            PRIVATE BY DEFAULT
          </p>
        </div>
      </section>

      {/* MEMETIC TRUTH SECTION */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '220px',
        paddingBottom: '220px',
        paddingLeft: '48px',
        paddingRight: '48px',
      }}>
        <h2 style={{
          fontFamily: 'Garamond, Sabon, Georgia, serif',
          fontSize: '72px',
          lineHeight: '82px',
          letterSpacing: '-0.03em',
          fontWeight: 400,
          color: '#0E1A2B',
          margin: '0 0 32px 0',
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
        paddingBottom: '160px',
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
            fontFamily: 'Garamond, Sabon, Georgia, serif',
            fontSize: '48px',
            lineHeight: '56px',
            letterSpacing: '-0.02em',
            fontWeight: 400,
            color: '#0E1A2B',
            margin: '0 0 40px 0',
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
            margin: '0 0 24px 0',
          }}>
            RunPayway™ identifies conditions that may support or weaken income reliability.
          </p>
        </div>

        {/* RIGHT - COMPARISON */}
        <div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 48px 0',
          }}>
            SAME INCOME. DIFFERENT STABILITY.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
          }}>
            {/* Profile A */}
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 16px 0',
              }}>
                PROFILE A
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '28px',
                fontWeight: 700,
                color: '#0E1A2B',
                margin: '0 0 8px 0',
              }}>
                $150K
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                margin: '0 0 24px 0',
              }}>
                Annual Income
              </p>
              <ul style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '14px',
                lineHeight: '24px',
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
                fontSize: '13px',
                fontWeight: 700,
                color: '#EF4444',
                margin: '24px 0 0 0',
              }}>
                DEVELOPING STABILITY
              </p>
            </div>

            {/* Profile B */}
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 16px 0',
              }}>
                PROFILE B
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '28px',
                fontWeight: 700,
                color: '#0E1A2B',
                margin: '0 0 8px 0',
              }}>
                $150K
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                margin: '0 0 24px 0',
              }}>
                Annual Income
              </p>
              <ul style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '14px',
                lineHeight: '24px',
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
                fontSize: '13px',
                fontWeight: 700,
                color: '#10B981',
                margin: '24px 0 0 0',
              }}>
                ESTABLISHED STABILITY
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT RUNPAYWAY EVALUATES */}
      <section style={{
        backgroundColor: '#FAFAF8',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        paddingTop: '120px',
        paddingBottom: '120px',
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
          <div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0 0 32px 0',
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
              fontSize: '14px',
              fontWeight: 600,
              color: '#0E1A2B',
              margin: '0 0 16px 0',
            }}>
              Including:
            </p>
            <ul style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '14px',
              lineHeight: '24px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0',
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
              fontSize: '14px',
              fontWeight: 600,
              color: '#0E1A2B',
              margin: '24px 0 8px 0',
            }}>
              Evaluated using a fixed, repeatable methodology.
            </p>
          </div>

          {/* Free Income Stability Insight */}
          <div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
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
              fontSize: '48px',
              fontWeight: 700,
              color: '#0E1A2B',
              margin: '0 0 32px 0',
            }}>
              $0
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '16px',
              lineHeight: '28px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 32px 0',
            }}>
              See how stable your income appears today.
            </p>
            <button style={{
              width: '100%',
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
              marginBottom: '24px',
            }}>
              START FREE INSIGHT
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              color: '#6B7280',
              margin: '0',
              textAlign: 'center',
            }}>
              No documents required
            </p>
          </div>

          {/* Full Stability Report */}
          <div>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
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
              margin: '0 0 32px 0',
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
            }}>
              Identify conditions that may strengthen or weaken income reliability.
            </p>
            <button style={{
              width: '100%',
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
              marginBottom: '24px',
            }}>
              UNLOCK FULL REPORT
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              color: '#6B7280',
              margin: '0',
              textAlign: 'center',
            }}>
              One-time purchase
            </p>
          </div>
        </div>
      </section>

      {/* FOR PROFESSIONAL REVIEW ENVIRONMENTS */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '160px',
        paddingBottom: '160px',
        paddingLeft: '48px',
        paddingRight: '48px',
      }}>
        <p style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#0E1A2B',
          margin: '0 0 32px 0',
        }}>
          FOR PROFESSIONAL REVIEW ENVIRONMENTS
        </p>
        <p style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '16px',
          lineHeight: '28px',
          fontWeight: 400,
          color: '#4B5563',
          margin: '0 0 32px 0',
          maxWidth: '700px',
        }}>
          RunPayway™ also supports advisor and organizational review workflows.
        </p>
        <a href="#" style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0.03em',
          color: '#0E1A2B',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}>
          Explore Professional Verification →
        </a>
      </section>

      {/* FRAMEWORK STANDARD */}
      <section style={{
        backgroundColor: '#FAFAF8',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '48px',
          paddingRight: '48px',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 32px 0',
          }}>
            FRAMEWORK STANDARD
          </p>
          <h3 style={{
            fontFamily: 'Garamond, Sabon, Georgia, serif',
            fontSize: '48px',
            lineHeight: '56px',
            letterSpacing: '-0.02em',
            fontWeight: 400,
            color: '#0E1A2B',
            margin: '0 0 32px 0',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Fixed rules. Deterministic results. Version-locked methodology.
          </h3>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0',
          }}>
            STRUCTURAL STABILITY MODEL RP-2.0
          </p>
        </div>
      </section>

      {/* STRUCTURAL EVALUATION NOTICE */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '160px',
        paddingBottom: '160px',
        paddingLeft: '48px',
        paddingRight: '48px',
      }}>
        <p style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#0E1A2B',
          margin: '0 0 32px 0',
        }}>
          STRUCTURAL EVALUATION NOTICE
        </p>
        <p style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '14px',
          lineHeight: '28px',
          fontWeight: 400,
          color: '#4B5563',
          margin: '0',
          maxWidth: '900px',
        }}>
          RunPayway™ evaluates income stability conditions using a fixed methodological framework. Results are informational only and are not financial, legal, tax, lending, insurance, investment, or employment advice. RunPayway™ does not guarantee future outcomes or replace professional judgment.
        </p>
      </section>

      {/* FINAL CTA */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '220px',
        paddingBottom: '220px',
        paddingLeft: '48px',
        paddingRight: '48px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'Garamond, Sabon, Georgia, serif',
          fontSize: '72px',
          lineHeight: '82px',
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
          color: '#4B5563',
          margin: '0 0 48px 0',
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
        }}>
          CHECK INCOME STABILITY
          <span style={{ fontSize: '14px' }}>→</span>
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        paddingTop: '120px',
        paddingBottom: '72px',
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
            gap: '128px',
            marginBottom: '64px',
            alignItems: 'flex-start',
          }}>
            {/* Logo */}
            <div>
              <img src="/rplogo.png" alt="RunPayway™" style={{
                height: '40px',
                width: 'auto',
              }} />
            </div>

            {/* Links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '80px',
            }}>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
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
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 20px 0',
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
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 20px 0',
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
                </ul>
              </div>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 20px 0',
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
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Model Version</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '80px',
          }}>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                lineHeight: '20px',
                fontWeight: 400,
                color: '#6B7280',
                margin: '0',
              }}>
                © 2026 RunPayway™ · All rights reserved<br />
                RunPayway™ is a product of PeopleStar Enterprises, Inc.<br />
                Orange County, California, USA<br />
                Structural Stability Model RP-2.0
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                lineHeight: '20px',
                fontWeight: 400,
                color: '#6B7280',
                margin: '0',
              }}>
                <a href="#" style={{ color: '#6B7280', textDecoration: 'none', marginRight: '24px' }}>Data Security</a>
                <a href="#" style={{ color: '#6B7280', textDecoration: 'none', marginRight: '24px' }}>System Integrity</a>
                <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Accessibility</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
