/* ================================================================ */
/* SECTION ICONS                                                    */
/* 6 Custom SVG icons for credibility and features                 */
/* ================================================================ */

export interface SectionIconProps {
  iconId: "credibility" | "adoption" | "compliance" | "integration" | "workflow" | "unlock";
  size?: number;
  color?: string;
  activeColor?: string;
  active?: boolean;
}

export default function SectionIcon({
  iconId,
  size = 48,
  color = "#0E1A2B",
  activeColor = "#1F6D7A",
  active = true,
}: SectionIconProps) {
  const strokeColor = active ? activeColor : color;
  const fillColor = active ? activeColor : color;
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
    /* Credibility - Checkmark with shield */
    case "credibility":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <path
            d="M 12 10 L 24 8 L 36 10 L 36 20 Q 36 32 24 40 Q 12 32 12 20 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinejoin="round"
          />
          <path d="M 18 24 L 22 28 L 30 18" stroke={fillColor} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    /* Adoption - Network/building connections */
    case "adoption":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <circle cx="24" cy="16" r="3" fill={fillColor} />
          <circle cx="14" cy="28" r="3" fill={fillColor} />
          <circle cx="34" cy="28" r="fill={fillColor} />
          <circle cx="24" cy="40" r="3" fill={fillColor} />
          <line x1="24" y1="19" x2="14" y2="25" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="24" y1="19" x2="34" y2="25" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="14" y1="31" x2="24" y2="37" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="34" y1="31" x2="24" y2="37" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );

    /* Compliance - Shield badge */
    case "compliance":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <path
            d="M 12 10 L 24 8 L 36 10 L 36 22 Q 36 34 24 42 Q 12 34 12 22 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="24" r="4" stroke={fillColor} strokeWidth={strokeWidth - 0.5} fill="none" />
          <line x1="24" y1="20" x2="24" y2="28" stroke={fillColor} strokeWidth={strokeWidth - 0.5} />
          <line x1="20" y1="24" x2="28" y2="24" stroke={fillColor} strokeWidth={strokeWidth - 0.5} />
        </svg>
      );

    /* Integration - Code/API brackets */
    case "integration":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <path d="M 16 14 L 10 24 L 16 34" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 32 14 L 38 24 L 32 34" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="20" y1="24" x2="28" y2="24" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    /* Workflow - Steps/progress timeline */
    case "workflow":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <circle cx="10" cy="24" r="3" fill={fillColor} />
          <circle cx="24" cy="24" r="3" fill={fillColor} />
          <circle cx="38" cy="24" r="3" fill={fillColor} />
          <line x1="13" y1="24" x2="21" y2="24" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="27" y1="24" x2="35" y2="24" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 38 20 L 42 24 L 38 28" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    /* Unlock - Key/access indicator */
    case "unlock":
      return (
        <svg {...commonProps} style={{ opacity }}>
          <rect x="12" y="22" width="24" height="18" rx="2" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 16 22 V 14 Q 16 10 20 10 Q 24 10 24 14" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
          <circle cx="24" cy="31" r="2" fill={fillColor} />
          <path d="M 24 33 V 35" stroke={fillColor} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
}
