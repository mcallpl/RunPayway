import React from 'react';

interface PageHeroProps {
  headline: string;
  subheadline?: string;
  body?: string;
  cta?: {
    label: string;
    href: string;
  };
  supportingText?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  headline,
  subheadline,
  body,
  cta,
  supportingText,
  children,
}: PageHeroProps) {
  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: 100,
        paddingBottom: 80,
        paddingLeft: 40,
        paddingRight: 40,
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            color: '#0E1A2B',
            marginBottom: 24,
            fontFamily: '"Cormorant Garamond", "Georgia", serif',
          }}
        >
          {headline}
        </h1>

        {subheadline && (
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#1F6D7A',
              marginBottom: 32,
            }}
          >
            {subheadline}
          </div>
        )}

        {body && (
          <p
            style={{
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#5E6873',
              marginBottom: 32,
              maxWidth: 620,
              margin: '0 auto 32px',
            }}
          >
            {body}
          </p>
        )}

        {cta && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <a
              href={cta.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 60,
                padding: '0 32px',
                borderRadius: 8,
                backgroundColor: '#0E1A2B',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background-color 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4B3FAE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0E1A2B';
              }}
            >
              {cta.label}
            </a>
            {supportingText && (
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#7B848E',
                  margin: 0,
                }}
              >
                {supportingText}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </header>
  );
}
