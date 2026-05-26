import React from 'react';
import Link from 'next/link';

interface PrimaryButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export default function PrimaryButton({
  href,
  onClick,
  children,
  className = '',
  external = false,
}: PrimaryButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingLeft: 32,
    paddingRight: 32,
    borderRadius: 8,
    backgroundColor: '#0E1A2B',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 150ms',
  };

  const handleMouseEnter = (e: React.MouseEvent<any>) => {
    e.currentTarget.style.backgroundColor = '#4B3FAE';
  };

  const handleMouseLeave = (e: React.MouseEvent<any>) => {
    e.currentTarget.style.backgroundColor = '#0E1A2B';
  };

  if (href) {
    return external ? (
      <a
        href={href}
        style={baseStyle}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    ) : (
      <Link
        href={href}
        style={baseStyle}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={baseStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
