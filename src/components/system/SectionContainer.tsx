import React from 'react';

interface SectionContainerProps {
  children: React.ReactNode;
  variant?: 'light' | 'sand' | 'navy';
  spacing?: 'default' | 'compact';
  className?: string;
}

export default function SectionContainer({
  children,
  variant = 'light',
  spacing = 'default',
  className = '',
}: SectionContainerProps) {
  const bgColor = {
    light: '#FFFFFF',
    sand: '#F4F1EA',
    navy: '#0E1A2B',
  }[variant];

  const py = spacing === 'compact' ? 56 : 80;
  const px = 40;

  return (
    <section
      style={{
        backgroundColor: bgColor,
        paddingTop: py,
        paddingBottom: py,
        paddingLeft: px,
        paddingRight: px,
        borderTop: variant === 'light' ? '1px solid #E5E7EB' : 'none',
      }}
      className={className}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {children}
      </div>
    </section>
  );
}
