"use client";

const C = {
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  navy: "#1C1635",
  amber: "#DC7814",
  red: "#9B2C2C",
};

const ICONS: Record<string, { paths: string; color: string }> = {
  first_report: {
    color: C.navy,
    paths: "M6 2h8l4 4v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm7 0v5h5M8 13h8M8 17h5M8 9h3",
  },
  simulator_explorer: {
    color: C.teal,
    paths: "M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35M11 8v6m-3-3h6",
  },
  pressuremap_viewer: {
    color: C.purple,
    paths: "M3 7l6-4 6 4 6-4v14l-6 4-6-4-6 4V7zm6-4v18m6-14v18",
  },
  action_starter: {
    color: C.teal,
    paths: "M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  action_half: {
    color: C.amber,
    paths: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  action_complete: {
    color: C.teal,
    paths: "M8 21l-4-4m0 0l4-4m-4 4h12a4 4 0 000-8h-1M16 3l4 4m0 0l-4 4m4-4H8a4 4 0 000 8h1",
  },
  score_up_5: {
    color: C.teal,
    paths: "M3 17l6-6 4 4 8-8m0 0h-6m6 0v6",
  },
  score_up_10: {
    color: C.purple,
    paths: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z",
  },
  band_shift: {
    color: C.amber,
    paths: "M5 3l14 9-14 9V3zm14 0v18",
  },
  streak_3: {
    color: C.amber,
    paths: "M12 2c1.5 3 5 5 5 9a5 5 0 01-10 0c0-4 3.5-6 5-9zm-2 14a2 2 0 004 0c0-1.5-1-2.5-2-4-1 1.5-2 2.5-2 4z",
  },
  streak_7: {
    color: C.purple,
    paths: "M12 2L4.5 20.3l.7.4L12 18l6.8 2.7.7-.4L12 2zm0 5l4.3 11.3L12 16.5l-4.3 1.8L12 7z",
  },
  two_assessments: {
    color: C.navy,
    paths: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h6m-6 4h4",
  },
};

export default function BadgeIcon({ iconId, size = 24, earned }: { iconId: string; size?: number; earned: boolean }) {
  const icon = ICONS[iconId];
  if (!icon) return <div style={{ width: size, height: size }} />;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={earned ? icon.color : "rgba(14,26,43,0.20)"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: "stroke 300ms ease, opacity 300ms ease", opacity: earned ? 1 : 0.5 }}
    >
      {icon.paths.split(/(?=[A-Z])/).length > 1 ? (
        <path d={icon.paths} />
      ) : (
        icon.paths.split(/(?<=z|Z)\s*(?=[A-Z])|(?<=\d)\s+(?=[A-Z])/).map((p, i) => (
          <path key={i} d={p} />
        ))
      )}
    </svg>
  );
}
