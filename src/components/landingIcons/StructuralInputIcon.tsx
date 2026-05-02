/* ================================================================ */
/* STRUCTURAL INPUT ICONS                                            */
/* 6 Custom SVG icons for income stability inputs                   */
/* ================================================================ */

export interface StructuralInputIconProps {
  iconId: "concentration" | "sources" | "visibility" | "variability" | "continuity" | "dependency";
  size?: number;
  color?: string;
  activeColor?: string;
  active?: boolean;
}

export default function StructuralInputIcon({
  iconId,
  size = 48,
  color = "#0E1A2B",
  activeColor = "#1F6D7A",
  active = true,
}: StructuralInputIconProps) {
  const strokeColor = active ? activeColor : color;
  const opacity = active ? 1 : 0.6;
  const strokeWidth = 2;

  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (iconId) {
    /* Concentration - Nested circles showing source depth */
    case "concentration":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <circle cx="24" cy="24" r="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="24" cy="24" r="10" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="24" cy="24" r="4" fill={strokeColor} />
        </svg>
      );

    /* Number of Sources - Network/multi-node diagram */
    case "sources":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <circle cx="12" cy="12" r="4" fill={strokeColor} />
          <circle cx="36" cy="12" r="4" fill={strokeColor} />
          <circle cx="24" cy="30" r="4" fill={strokeColor} />
          <line x1="12" y1="12" x2="24" y2="30" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="36" y1="12" x2="24" y2="30" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="12" y1="12" x2="36" y2="12" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.5" />
        </svg>
      );

    /* Forward Visibility - Timeline/calendar with arrow */
    case "visibility":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <rect x="8" y="10" width="32" height="26" rx="2" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="14" y1="10" x2="14" y2="36" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="34" y1="10" x2="34" y2="36" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="8" y1="18" x2="40" y2="18" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.5" />
          <path d="M 32 26 L 40 26 L 36 32 Z" fill={strokeColor} />
        </svg>
      );

    /* Income Variability - Wave/volatility graph */
    case "variability":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <path
            d="M 8 24 Q 14 16 20 24 T 32 24 T 44 24"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="8" y1="34" x2="44" y2="34" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.3" />
          <circle cx="20" cy="24" r="2" fill={strokeColor} />
          <circle cx="32" cy="24" r="2" fill={strokeColor} />
        </svg>
      );

    /* Continuity Without Active Labor - Recurring/passive stream */
    case "continuity":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <path d="M 12 28 L 12 18 Q 12 12 18 12 L 30 12" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
          <path d="M 30 12 L 28 10 M 30 12 L 28 14" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <rect x="12" y="32" width="24" height="4" rx="2" fill={strokeColor} opacity="0.3" />
          <rect x="12" y="38" width="24" height="4" rx="2" fill={strokeColor} opacity="0.3" />
        </svg>
      );

    /* Dependency on Activity - Person/effort with directional arrows */
    case "dependency":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <circle cx="24" cy="12" r="3" fill={strokeColor} />
          <path d="M 24 15 L 24 26" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 16 20 L 24 26 L 32 20" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 8 36 L 14 30" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 14 28 L 10 32 L 14 34" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 40 36 L 34 30" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 34 28 L 38 32 L 34 34" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    default:
      return null;
  }
}
