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
              height: '54px',
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
            Check My Income Stability
            <span style={{ fontSize: '14px' }}>→</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '128px',
        paddingBottom: '80px',
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
            margin: '0 0 24px 0',
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
            margin: '0 0 32px 0',
            maxWidth: '520px',
          }}>
            RunPayway™ shows how stable your income really appears to be.
          </p>

          {/* CTA Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '32px',
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
              Check My Income Stability
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
              How It Works
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
          </div>

          {/* Supporting Line */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
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
            margin: '0 0 16px 0',
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
            lineHeight: '24px',
            fontWeight: 400,
            color: '#4B5563',
            margin: '0 0 32px 0',
          }}>
            Income currently appears stable, though some conditions may weaken income reliability over time.
          </p>

          {/* Condition Grid */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px 48px',
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
            paddingTop: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
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

      {/* COMMON INCOME CONDITIONS */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '160px',
        paddingBottom: '160px',
        paddingLeft: '48px',
        paddingRight: '48px',
        borderTop: '1px solid #E5E7EB',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {[
            'most income depends on a single client, customer, employer, or source',
            'income changes significantly from month to month',
            'income slows quickly when work slows down',
            'financial obligations continue growing while income remains variable',
            'future income becomes harder to predict with confidence',
            'limited backup income exists if current income changes unexpectedly',
          ].map((condition, index) => (
            <div key={index} style={{
              paddingBottom: '24px',
              borderBottom: index < 5 ? '1px solid #E5E7EB' : 'none',
            }}>
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '15px',
                lineHeight: '26px',
                fontWeight: 400,
                color: '#4B5563',
                margin: '0',
              }}>
                • {condition}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: 'Garamond, Sabon, Georgia, serif',
          fontSize: '48px',
          lineHeight: '56px',
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
            flex: 1,
            textAlign: 'center',
          }}>
            FIXED METHODOLOGY
          </p>
          <div style={{
            width: '1px',
            height: '24px',
            backgroundColor: '#E5E7EB',
            margin: '0 48px',
          }} />
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0',
            flex: 1,
            textAlign: 'center',
          }}>
            CONSISTENT RESULTS
          </p>
          <div style={{
            width: '1px',
            height: '24px',
            backgroundColor: '#E5E7EB',
            margin: '0 48px',
          }} />
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0',
            flex: 1,
            textAlign: 'center',
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
        paddingBottom: '100px',
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
        paddingTop: '100px',
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
            margin: '0',
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
            <div style={{
              paddingRight: '24px',
              borderRight: '1px solid #E5E7EB',
            }}>
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
            <div style={{
              paddingLeft: '24px',
            }}>
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

          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '28px',
            fontWeight: 400,
            color: '#4B5563',
            margin: '48px 0 0 0',
            paddingTop: '48px',
            borderTop: '1px solid #E5E7EB',
          }}>
            Income amount alone does not determine income stability.
          </p>
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
          <div style={{
            paddingRight: '24px',
            borderRight: '1px solid #E5E7EB',
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
              margin: '0 0 24px 0',
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
              margin: '0',
            }}>
              Evaluated using a fixed, repeatable methodology.
            </p>
          </div>

          {/* Free Income Stability Insight */}
          <div style={{
            paddingLeft: '24px',
            paddingRight: '24px',
            borderRight: '1px solid #E5E7EB',
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
              FREE INCOME STABILITY INSIGHT
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '48px',
              fontWeight: 700,
              color: '#0E1A2B',
              margin: '0 0 16px 0',
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
              Start Free Insight
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
          <div style={{
            paddingLeft: '24px',
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
              FULL STABILITY REPORT
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '48px',
              fontWeight: 700,
              color: '#0E1A2B',
              margin: '0 0 16px 0',
            }}>
              $69
            </p>
            <p style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '16px',
              lineHeight: '28px',
              fontWeight: 400,
              color: '#4B5563',
              margin: '0 0 24px 0',
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
              lineHeight: '24px',
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
              Unlock Full Report
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
        backgroundColor: '#FFFFFF',
        paddingTop: '120px',
        paddingBottom: '120px',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
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
            PROFESSIONAL REVIEW ENVIRONMENTS
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
            RunPayway™ also supports professional review environments for client and operational income evaluations.
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
        </div>
      </section>

      {/* FRAMEWORK STANDARD */}
      <section style={{
        backgroundColor: '#FAFAF8',
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
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 64px 0',
            textAlign: 'center',
          }}>
            FRAMEWORK STANDARD
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '48px',
            marginBottom: '64px',
          }}>
            <div style={{
              paddingRight: '24px',
              borderRight: '1px solid #E5E7EB',
            }}>
              <p style={{
                fontFamily: 'Garamond, Sabon, Georgia, serif',
                fontSize: '36px',
                lineHeight: '44px',
                letterSpacing: '-0.02em',
                fontWeight: 400,
                color: '#0E1A2B',
                margin: '0',
              }}>
                Fixed rules.
              </p>
            </div>
            <div style={{
              paddingLeft: '24px',
              paddingRight: '24px',
              borderRight: '1px solid #E5E7EB',
            }}>
              <p style={{
                fontFamily: 'Garamond, Sabon, Georgia, serif',
                fontSize: '36px',
                lineHeight: '44px',
                letterSpacing: '-0.02em',
                fontWeight: 400,
                color: '#0E1A2B',
                margin: '0',
              }}>
                Deterministic results.
              </p>
            </div>
            <div style={{
              paddingLeft: '24px',
            }}>
              <p style={{
                fontFamily: 'Garamond, Sabon, Georgia, serif',
                fontSize: '36px',
                lineHeight: '44px',
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
            marginBottom: '64px',
            paddingBottom: '64px',
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
            fontSize: '13px',
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
          RunPayway™ evaluates income stability conditions using a fixed methodological framework. Results are informational and are not financial, legal, tax, lending, insurance, investment, or employment advice. RunPayway™ does not guarantee future outcomes or replace professional judgment.
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
            {/* Logo & Tagline */}
            <div>
              <img src="/rplogo.png" alt="RunPayway™" style={{
                height: '40px',
                width: 'auto',
                marginBottom: '12px',
              }} />
              <p style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
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
                paddingRight: '24px',
                borderRight: '1px solid #E5E7EB',
              }}>
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
              <div style={{
                paddingLeft: '24px',
                paddingRight: '24px',
                borderRight: '1px solid #E5E7EB',
              }}>
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
              <div style={{
                paddingLeft: '24px',
                paddingRight: '24px',
                borderRight: '1px solid #E5E7EB',
              }}>
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
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Accessibility</a></li>
                </ul>
              </div>
              <div style={{
                paddingLeft: '24px',
              }}>
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
                  <li><a href="#" style={{ color: '#4B5563', textDecoration: 'none' }}>Data Security</a></li>
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
                © 2026 RunPayway™. All rights reserved.<br />
                RunPayway™ is a product of PeopleStar Enterprises, INC.<br />
                Orange County, California, USA.<br />
                Structural Stability Model RP-2.0.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
