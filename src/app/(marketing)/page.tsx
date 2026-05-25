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
          maxWidth: '1440px',
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
            gap: '40px',
            alignItems: 'center',
            flex: 1,
          }}>
            {['HOW IT WORKS', 'METHODOLOGY', 'USE CASES', 'FOR PROFESSIONALS', 'VERIFICATION ENVIRONMENTS', 'LEARN'].map((item) => (
              <a key={item} href="#" style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
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
            height: '48px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundColor: '#0E1A2B',
            color: '#FFFFFF',
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: 'auto',
          }}>
            BEGIN VERIFICATION
            <span style={{ fontSize: '16px' }}>→</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{
        maxWidth: '1120px',
        margin: '0 auto',
        paddingTop: '128px',
        paddingBottom: '168px',
        paddingLeft: '48px',
        paddingRight: '48px',
        display: 'grid',
        gridTemplateColumns: '7fr 5fr',
        gap: '96px',
        alignItems: 'flex-start',
      }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Eyebrow */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#2563EB',
            margin: '0 0 24px 0',
          }}>
            FOR INDIVIDUALS, ADVISORS, AND ORGANIZATIONS.
          </p>

          {/* H1 */}
          <h1 style={{
            fontFamily: 'Garamond, Sabon, Georgia, serif',
            fontSize: '72px',
            lineHeight: '78px',
            letterSpacing: '-0.03em',
            fontWeight: 400,
            color: '#0E1A2B',
            maxWidth: '600px',
            margin: '0 0 32px 0',
          }}>
            Income can appear stable long before the foundation behind it actually is.
          </h1>

          {/* Secondary Copy */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '1.7',
            fontWeight: 600,
            color: '#2563EB',
            maxWidth: '480px',
            margin: '32px 0 0 0',
          }}>
            Know whether your income is built on stable ground.
          </p>

          {/* Body Copy */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '1.7',
            fontWeight: 400,
            color: '#1B2B52',
            maxWidth: '480px',
            margin: '24px 0 0 0',
          }}>
            RunPayway™ verifies how stable income really appears to be.
          </p>

          {/* CTA Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            margin: '40px 0 0 0',
            alignItems: 'center',
          }}>
            <button style={{
              height: '60px',
              paddingLeft: '32px',
              paddingRight: '32px',
              backgroundColor: '#0E1A2B',
              color: '#FFFFFF',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: '0px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              BEGIN STRUCTURAL VERIFICATION
              <span style={{ fontSize: '16px' }}>→</span>
            </button>
            <button style={{
              height: '60px',
              paddingLeft: '32px',
              paddingRight: '32px',
              backgroundColor: 'transparent',
              color: '#0E1A2B',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: '1px solid #0E1A2B',
              borderRadius: '0px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              HOW IT WORKS
              <span style={{ fontSize: '16px' }}>→</span>
            </button>
          </div>

          {/* Support Copy */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            lineHeight: '1.7',
            fontWeight: 400,
            color: '#666666',
            maxWidth: '420px',
            margin: '32px 0 0 0',
          }}>
            Initial income stability visibility provided at no cost.
          </p>
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

          {/* Income Stability Score™ Label */}
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

          {/* Score Number */}
          <div style={{
            fontSize: '84px',
            lineHeight: '1',
            fontWeight: 700,
            color: '#0E1A2B',
            margin: '0 0 16px 0',
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontVariantNumeric: 'tabular-nums',
          }}>
            72
          </div>

          {/* Classification */}
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

          {/* Condition States */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginBottom: '32px',
          }}>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                MONTHLY INCOME CONSISTENCY — MODERATE
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                SOURCE DEPENDENCE — MANAGEABLE
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                RECURRING INCOME — STRONG
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                INCOME RELIABILITY PRESSURE — ELEVATED
              </p>
            </div>
          </div>

          {/* Model Info */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '32px',
          }}>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0E1A2B',
              margin: '0 0 24px 0',
            }}>
              MODEL VERSION — RP-2.0
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0E1A2B',
              margin: '0 0 24px 0',
            }}>
              INTEGRITY — Same structure produces same result
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0E1A2B',
              margin: '0',
            }}>
              FRAMEWORK — Fixed Methodology
            </p>
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
          maxWidth: '1120px',
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
        maxWidth: '1120px',
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
          lineHeight: '78px',
          letterSpacing: '-0.03em',
          fontWeight: 400,
          color: '#0E1A2B',
          margin: '0',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          High income does not always mean dependable income.
        </h2>
      </section>

      {/* COMMONLY REVIEWED BEFORE SECTION */}
      <section style={{
        maxWidth: '1120px',
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
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#0E1A2B',
          margin: '0 0 32px 0',
        }}>
          COMMONLY REVIEWED BEFORE:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '32px',
        }}>
          {['Mortgage Applications', 'Business Expansion', 'Income Transitions', 'Operational Scaling', 'Financial Commitments', 'Career Changes'].map((item, idx) => (
            <div key={idx} style={{
              paddingBottom: '16px',
              borderBottom: '1px solid #E5E7EB',
            }}>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0E1A2B',
                margin: '0',
              }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STRUCTURAL REALITY SECTION */}
      <section style={{
        maxWidth: '1120px',
        margin: '0 auto',
        paddingTop: '160px',
        paddingBottom: '160px',
        paddingLeft: '48px',
        paddingRight: '48px',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '120px',
        alignItems: 'flex-start',
      }}>
        {/* LEFT COLUMN */}
        <div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 4px 0',
          }}>
            STRUCTURAL REALITY
          </p>
          <div style={{
            width: '40px',
            height: '1px',
            backgroundColor: '#E5E7EB',
            margin: '16px 0 24px 0',
          }}></div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '1.7',
            fontWeight: 400,
            color: '#1B2B52',
            margin: '0 0 16px 0',
          }}>
            Income amount alone does not determine financial stability.
          </p>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '1.7',
            fontWeight: 400,
            color: '#1B2B52',
            margin: '0 0 16px 0',
          }}>
            Two people earning similar income can operate under very different stability conditions.
          </p>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '1.7',
            fontWeight: 400,
            color: '#1B2B52',
            margin: '0',
          }}>
            RunPayway™ evaluates the conditions supporting income using fixed structural rules.
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 48px 0',
          }}>
            SAME INCOME. DIFFERENT STABILITY CONDITIONS.
          </p>

          {/* Comparison Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 40px 1fr',
            gap: '48px',
            alignItems: 'center',
          }}>
            {/* Profile A */}
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 16px 0',
              }}>
                PROFILE A
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#0E1A2B',
                margin: '0 0 16px 0',
              }}>
                $150K
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#6B7280',
                margin: '0 0 16px 0',
              }}>
                Annual income
              </p>
              <ul style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '14px',
                lineHeight: '1.8',
                fontWeight: 400,
                color: '#1B2B52',
                margin: '0',
                paddingLeft: '0',
                listStyle: 'none',
              }}>
                <li>• 1 primary client</li>
                <li>• Inconsistent monthly distribution</li>
                <li>• no long-term agreements</li>
                <li>• high dependency on active production</li>
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

            {/* VS */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                color: '#0E1A2B',
                margin: '0',
              }}>
                vs.
              </p>
            </div>

            {/* Profile B */}
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 16px 0',
              }}>
                PROFILE B
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '32px',
                fontWeight: 700,
                color: '#0E1A2B',
                margin: '0 0 16px 0',
              }}>
                $150K
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#6B7280',
                margin: '0 0 16px 0',
              }}>
                Annual income
              </p>
              <ul style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '14px',
                lineHeight: '1.8',
                fontWeight: 400,
                color: '#1B2B52',
                margin: '0',
                paddingLeft: '0',
                listStyle: 'none',
              }}>
                <li>• 7 distributed income sources</li>
                <li>• recurring monthly agreements</li>
                <li>• diversified recurring income conditions</li>
                <li>• lower reliance on any single income source</li>
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

          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '14px',
            lineHeight: '1.7',
            fontWeight: 400,
            color: '#4B5563',
            margin: '64px 0 0 0',
          }}>
            RunPayway™ helps identify these differences through a fixed verification framework.
          </p>
        </div>
      </section>

      {/* VERIFICATION TIERS SECTION */}
      <section style={{
        maxWidth: '1120px',
        margin: '0 auto',
        paddingTop: '160px',
        paddingBottom: '160px',
        paddingLeft: '48px',
        paddingRight: '48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '64px',
      }}>
        {/* Tier 1: Basic */}
        <div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 12px 0',
          }}>
            BASIC STRUCTURAL INSIGHT™
          </p>
          <div style={{
            width: '40px',
            height: '1px',
            backgroundColor: '#E5E7EB',
            margin: '0 0 24px 0',
          }}></div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#0E1A2B',
            margin: '0 0 24px 0',
          }}>
            No Cost
          </p>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '15px',
            lineHeight: '1.7',
            fontWeight: 400,
            color: '#1B2B52',
            margin: '0 0 32px 0',
          }}>
            Initial visibility into the stability conditions supporting your income.
          </p>
          <button style={{
            width: '100%',
            height: '52px',
            backgroundColor: '#FFFFFF',
            color: '#0E1A2B',
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: '1px solid #0E1A2B',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            START BASIC EVALUATION
            <span style={{ fontSize: '16px' }}>→</span>
          </button>
        </div>

        {/* Tier 2: Full */}
        <div style={{
          backgroundColor: '#0E1A2B',
          color: '#FFFFFF',
          padding: '40px',
          borderRadius: '0px',
        }}>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: '0 0 12px 0',
          }}>
            FULL STRUCTURAL VERIFICATION™
          </p>
          <div style={{
            width: '40px',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            margin: '0 0 24px 0',
          }}></div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: '0 0 24px 0',
          }}>
            $69
          </p>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '15px',
            lineHeight: '1.7',
            fontWeight: 400,
            color: '#E5E7EB',
            margin: '0 0 32px 0',
          }}>
            Expanded visibility into the conditions affecting income stability.
          </p>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: '0 0 16px 0',
          }}>
            VERIFICATION ENVIRONMENT INCLUDES:
          </p>
          <ul style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '14px',
            lineHeight: '2',
            fontWeight: 400,
            color: '#E5E7EB',
            margin: '0 0 32px 0',
            paddingLeft: '0',
            listStyle: 'none',
          }}>
            <li>— Income Stability Score™</li>
            <li>— Stability Scenario Analysis™</li>
            <li>— Industry-Aware Interpretation</li>
            <li>— Highest-Impact Stability Opportunities</li>
          </ul>
          <button style={{
            width: '100%',
            height: '52px',
            backgroundColor: '#FFFFFF',
            color: '#0E1A2B',
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            UNLOCK FULL VERIFICATION
            <span style={{ fontSize: '16px' }}>→</span>
          </button>
        </div>

        {/* Tier 3: Professional */}
        <div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 12px 0',
          }}>
            FOR PROFESSIONALS
          </p>
          <div style={{
            width: '40px',
            height: '1px',
            backgroundColor: '#E5E7EB',
            margin: '0 0 24px 0',
          }}></div>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '15px',
            lineHeight: '1.7',
            fontWeight: 400,
            color: '#1B2B52',
            margin: '0 0 32px 0',
          }}>
            Professional verification environments support repeatable review across client and operational evaluations.
          </p>
          <button style={{
            width: '100%',
            height: '52px',
            backgroundColor: '#FFFFFF',
            color: '#0E1A2B',
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: '1px solid #0E1A2B',
            borderRadius: '0px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            EXPLORE PROFESSIONAL VERIFICATION
            <span style={{ fontSize: '16px' }}>→</span>
          </button>
        </div>
      </section>

      {/* SYSTEM INTEGRITY SECTION */}
      <section style={{
        backgroundColor: '#FAFAF8',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}>
        <div style={{
          maxWidth: '1120px',
          margin: '0 auto',
          paddingLeft: '48px',
          paddingRight: '48px',
        }}>
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 48px 0',
          }}>
            SYSTEM INTEGRITY
          </p>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '48px',
            marginBottom: '64px',
          }}>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 12px 0',
              }}>
                FIXED RULES.
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '15px',
                lineHeight: '1.7',
                fontWeight: 400,
                color: '#1B2B52',
                margin: '0',
              }}>
                Evaluations are derived exclusively from a fixed methodological framework.
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 12px 0',
              }}>
                DETERMINISTIC RESULTS.
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '15px',
                lineHeight: '1.7',
                fontWeight: 400,
                color: '#1B2B52',
                margin: '0',
              }}>
                Same inputs, through the same framework, always produce the same result.
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 12px 0',
              }}>
                VERSION-LOCKED METHODOLOGY.
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '15px',
                lineHeight: '1.7',
                fontWeight: 400,
                color: '#1B2B52',
                margin: '0',
              }}>
                Every evaluation is stamped to the exact methodology version used.
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#0E1A2B',
                margin: '0 0 12px 0',
              }}>
                STRUCTURAL STABILITY MODEL
              </p>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '24px',
                fontWeight: 700,
                color: '#0E1A2B',
                margin: '0',
              }}>
                RP-2.0
              </p>
            </div>
          </div>

          {/* Evaluation Notice */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E5E7EB',
            borderBottom: '1px solid #E5E7EB',
            paddingTop: '24px',
            paddingBottom: '24px',
          }}>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#0E1A2B',
              margin: '0 0 16px 0',
            }}>
              STRUCTURAL EVALUATION NOTICE:
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '14px',
              lineHeight: '1.7',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0',
            }}>
              RunPayway™ evaluates income stability conditions using a fixed methodological framework. Results are informational only and not financial, legal, tax, lending, insurance, investment, or employment advice. RunPayway™ does not guarantee future outcomes or replace professional judgment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        maxWidth: '1120px',
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
          lineHeight: '78px',
          letterSpacing: '-0.03em',
          fontWeight: 400,
          color: '#0E1A2B',
          margin: '0 0 32px 0',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Structural clarity before important financial decisions.
        </h2>
        <p style={{
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '16px',
          fontWeight: 400,
          color: '#4B5563',
          margin: '0 0 48px 0',
        }}>
          Complete your verification in under 2 minutes.
        </p>
        <button style={{
          height: '60px',
          paddingLeft: '32px',
          paddingRight: '32px',
          backgroundColor: '#0E1A2B',
          color: '#FFFFFF',
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          border: 'none',
          borderRadius: '0px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          BEGIN STRUCTURAL VERIFICATION
          <span style={{ fontSize: '16px' }}>→</span>
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
          maxWidth: '1120px',
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
            {/* Logo Section */}
            <div>
              <img src="/rplogo.png" alt="RunPayway™" style={{
                height: '48px',
                width: 'auto',
              }} />
            </div>

            {/* Links Columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '64px',
            }}>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 16px 0',
                }}>
                  Product
                </p>
                <ul style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  lineHeight: '2',
                  fontWeight: 400,
                  color: '#4B5563',
                  margin: '0',
                  paddingLeft: '0',
                  listStyle: 'none',
                }}>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>How It Works</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Methodology</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Use Cases</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>For Professionals</a></li>
                </ul>
              </div>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 16px 0',
                }}>
                  Learn
                </p>
                <ul style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  lineHeight: '2',
                  fontWeight: 400,
                  color: '#4B5563',
                  margin: '0',
                  paddingLeft: '0',
                  listStyle: 'none',
                }}>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Learn</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Contact</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Data Security</a></li>
                </ul>
              </div>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 16px 0',
                }}>
                  Legal
                </p>
                <ul style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  lineHeight: '2',
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
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 16px 0',
                }}>
                  Verification
                </p>
                <ul style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  lineHeight: '2',
                  fontWeight: 400,
                  color: '#4B5563',
                  margin: '0',
                  paddingLeft: '0',
                  listStyle: 'none',
                }}>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Verification Environments</a></li>
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>System Integrity</a></li>
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
            gap: '64px',
          }}>
            <div>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '13px',
                lineHeight: '1.7',
                fontWeight: 400,
                color: '#4B5563',
                margin: '0',
              }}>
                © 2025 RunPayway™ - All rights reserved<br />
                RunPayway™ is a product of PeopleStar Enterprises, Inc.<br />
                Orange County, California, USA.<br />
                Structural Stability Model RP-2.0
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
