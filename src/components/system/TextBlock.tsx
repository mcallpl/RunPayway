import React from 'react';

interface TextBlockProps {
  children: React.ReactNode;
  type?: 'body' | 'bodylg' | 'small' | 'micro';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
  style?: React.CSSProperties;
}

export default function TextBlock({
  children,
  type = 'body',
  color = 'primary',
  className = '',
  style = {},
}: TextBlockProps) {
  const typeStyles = {
    body: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.6,
    },
    bodylg: {
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 1.6,
    },
    small: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.5,
    },
    micro: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.4,
    },
  };

  const colorStyles = {
    primary: '#131A22',
    secondary: '#5E6873',
    muted: '#7B848E',
  };

  return (
    <div
      style={{
        ...typeStyles[type],
        color: colorStyles[color],
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
