import React from 'react';

interface InstitutionalDividerProps {
  variant?: 'light' | 'dark';
  style?: React.CSSProperties;
}

export default function InstitutionalDivider({
  variant = 'light',
  style = {},
}: InstitutionalDividerProps) {
  const color = variant === 'light' ? '#E5E7EB' : 'rgba(255,255,255,0.1)';

  return (
    <div
      style={{
        height: 1,
        backgroundColor: color,
        margin: 0,
        ...style,
      }}
    />
  );
}
