'use client';

import React, { useState } from 'react';

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
      {/* HEADER - EXACT SPECIFICATION */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '32px',
        paddingRight: '32px',
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
          <a href="/RunPayway" style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            marginRight: '80px',
            textDecoration: 'none',
          }}>
            <img src="/RunPayway/logo.png" alt="RunPayway™" style={{
              height: '56px',
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
            {['How It Works', 'Methodology', 'Use Cases', 'Reports', 'For Professionals', 'Learn', 'About'].map((item) => (
              <a key={item} href="#" style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '1',
                letterSpacing: '0',
                color: '#0E1A2B',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0E2A7B'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#0E1A2B'}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            marginLeft: 'auto',
          }}>
            <a href="#sign-in" style={{
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0E1A2B',
              textDecoration: 'none',
              cursor: 'pointer',
            }}>
              Sign In
            </a>
            <button style={{
              height: '42px',
              paddingLeft: '22px',
              paddingRight: '22px',
              backgroundColor: '#0E2A7B',
              color: '#FFFFFF',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a1d5c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0E2A7B'}
            >
              Start Evaluation
              <span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION - EXACT SPECIFICATION */}
      <section style={{
        maxWidth: '1440px',
        margin: '0 auto',
        paddingTop: '96px',
        paddingBottom: '92px',
        paddingLeft: '32px',
        paddingRight: '32px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '72px',
        alignItems: 'center',
      }}>
        {/* LEFT COLUMN */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Eyebrow */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0E2A7B',
            margin: '0 0 28px 0',
          }}>
            FOR INDEPENDENT INCOME STRUCTURES.
          </p>

          {/* H1 */}
          <h1 style={{
            fontFamily: 'Canela, Freight Display, Editorial New, Georgia, serif',
            fontSize: '64px',
            lineHeight: '1.06',
            letterSpacing: '-0.045em',
            fontWeight: 400,
            color: '#0E2A7B',
            maxWidth: '540px',
            margin: '0 0 40px 0',
          }}>
            The Standard for Measuring Income Stability.
          </h1>

          {/* Body Copy */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            lineHeight: '1.72',
            fontWeight: 400,
            letterSpacing: '0',
            color: '#1B2B52',
            maxWidth: '420px',
            margin: '0 0 56px 0',
          }}>
            RunPayway™ evaluates how resilient income remains under real-world conditions before financial, business, and career decisions are made.
          </p>

          {/* Divider Line - BLUE */}
          <div style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#0E2A7B',
            margin: '0 0 32px 0',
          }}></div>

          {/* INCOME DOES NOT EQUAL STABILITY */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 28px 0',
          }}>
            INCOME DOES NOT EQUAL STABILITY.
          </p>

          {/* CTA Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            margin: '0 0 24px 0',
          }}>
            <button style={{
              height: '48px',
              paddingLeft: '24px',
              paddingRight: '24px',
              backgroundColor: '#0E2A7B',
              color: '#FFFFFF',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a1d5c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0E2A7B'}
            >
              Start Free Evaluation
            </button>
            <button style={{
              height: '48px',
              paddingLeft: '24px',
              paddingRight: '24px',
              backgroundColor: 'transparent',
              color: '#0E1A2B',
              fontFamily: 'Inter, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(14, 42, 123, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              How it works
              <span>→</span>
            </button>
          </div>

          {/* Support Copy */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '13px',
            lineHeight: '1.72',
            fontWeight: 400,
            color: '#4B5563',
            maxWidth: '420px',
            margin: '0',
          }}>
            Free evaluation includes Stability Classification™ and primary exposure indicator.<br />
            Full Income Stability Score™ and evaluation report available for $69.
          </p>
        </div>

        {/* RIGHT COLUMN - SCORE FRAMEWORK CARD */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E6EAF2',
          borderRadius: '12px',
          paddingTop: '48px',
          paddingLeft: '56px',
          paddingRight: '56px',
          paddingBottom: '44px',
          boxShadow: 'none',
        }}>
          {/* Card Title */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 28px 0',
          }}>
            INCOME STABILITY SCORE™
          </p>

          {/* Score Number */}
          <div style={{
            fontSize: '108px',
            lineHeight: '0.92',
            letterSpacing: '-0.06em',
            fontWeight: 500,
            color: '#0E2A7B',
            margin: '0 0 16px 0',
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontVariantNumeric: 'tabular-nums',
          }}>
            72
          </div>

          {/* Classification */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: '#0E1A2B',
            margin: '0 0 28px 0',
          }}>
            ESTABLISHED STABILITY
          </p>

          {/* Description */}
          <p style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: '14px',
            lineHeight: '1.72',
            fontWeight: 400,
            color: '#1B2B52',
            maxWidth: '460px',
            margin: '0 0 36px 0',
          }}>
            Recurring income characteristics with moderate diversification, continuity, and forward visibility.
          </p>

          {/* Range Visualization */}
          <div style={{ margin: '0 0 32px 0' }}>
            {/* Bars */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <div style={{
                height: '5px',
                borderRadius: '999px',
                backgroundColor: '#D8DCE5',
              }}></div>
              <div style={{
                height: '5px',
                borderRadius: '999px',
                backgroundColor: '#D8DCE5',
              }}></div>
              <div style={{
                height: '5px',
                borderRadius: '999px',
                backgroundColor: '#0E2A7B',
              }}></div>
              <div style={{
                height: '5px',
                borderRadius: '999px',
                backgroundColor: '#D8DCE5',
              }}></div>
            </div>

            {/* Labels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}>
              {['0–39', '40–59', '60–79', '80–100'].map((label, idx) => (
                <p key={idx} style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  lineHeight: '1',
                  letterSpacing: '0',
                  color: idx === 2 ? '#0E2A7B' : '#6B7280',
                  margin: '0',
                  textAlign: 'center',
                }}>
                  {label}
                </p>
              ))}
            </div>
          </div>

          {/* Scale Label */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 0 32px 0',
            fontSize: '13px',
            fontWeight: 600,
            color: '#6B7280',
            fontFamily: 'Inter, -apple-system, sans-serif',
          }}>
            <span>0</span>
            <span>SCORE RANGE 0–100</span>
            <span>100</span>
          </div>

          {/* Metadata Grid */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '28px',
          }}>
            {/* First Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              margin: '0 0 28px 0',
              paddingBottom: '28px',
              borderBottom: '1px solid #E5E7EB',
            }}>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  margin: '0 0 8px 0',
                }}>
                  Revenue Structure
                </p>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '1.5',
                  color: '#0E1A2B',
                  margin: '0',
                }}>
                  Distributed
                </p>
              </div>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  margin: '0 0 8px 0',
                }}>
                  Continuity
                </p>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '1.5',
                  color: '#0E1A2B',
                  margin: '0',
                }}>
                  Moderate
                </p>
              </div>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  margin: '0 0 8px 0',
                }}>
                  Labor Independence
                </p>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '1.5',
                  color: '#0E1A2B',
                  margin: '0',
                }}>
                  Partial
                </p>
              </div>
            </div>

            {/* Second Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
            }}>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  margin: '0 0 8px 0',
                }}>
                  Model
                </p>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '1.5',
                  color: '#0E1A2B',
                  margin: '0',
                }}>
                  RP-2.0
                </p>
              </div>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  margin: '0 0 8px 0',
                }}>
                  Evaluation
                </p>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '1.5',
                  color: '#0E1A2B',
                  margin: '0',
                }}>
                  Version-Stamped
                </p>
              </div>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  margin: '0 0 8px 0',
                }}>
                  Integrity
                </p>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '1.5',
                  color: '#0E1A2B',
                  margin: '0',
                }}>
                  Same inputs<br/>produce same result
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY STRIP - EXACT SPECIFICATION */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          paddingLeft: '32px',
          paddingRight: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '80px',
        }}>
          {[
            {
              icon: '⚙',
              title: 'DETERMINISTIC METHODOLOGY',
              subtitle: 'Fixed scoring architecture'
            },
            {
              icon: '⊞',
              title: 'VERSION-STAMPED RESULTS',
              subtitle: 'Tied to model version'
            },
            {
              icon: '🔒',
              title: 'PRIVATE BY DEFAULT',
              subtitle: 'Your data stays yours'
            }
          ].map((block, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}>
              <div style={{
                fontSize: '24px',
                flexShrink: 0,
              }}>
                {block.icon}
              </div>
              <div>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#0E1A2B',
                  margin: '0 0 4px 0',
                }}>
                  {block.title}
                </p>
                <p style={{
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '13px',
                  fontWeight: 400,
                  lineHeight: '1.6',
                  color: '#4B5563',
                  margin: '0',
                }}>
                  {block.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Placeholder for remaining sections */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '96px 32px',
        textAlign: 'center',
        color: '#999',
      }}>
        Additional sections to be implemented with same precision
      </div>
    </div>
  );
}
