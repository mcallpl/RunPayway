import { getSocialLinks } from "@/lib/social-config";

const SOCIAL_ITEMS = [
  {
    key: "x" as const,
    label: "X",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.4l7.3-8.4L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L6.1 3.9H4.3L17.8 20Z"
        />
      </svg>
    ),
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5ZM0.5 23.5h4V7.98h-4V23.5Zm7 0h4V15c0-2.28.43-4.49 3.25-4.49 2.78 0 2.81 2.6 2.81 4.64v8.35h4V14.3c0-4.52-.97-8-6.26-8-2.54 0-4.24 1.39-4.94 2.71h-.05V7.98h-3.81V23.5Z"
        />
      </svg>
    ),
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H16.7V4.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4Z"
        />
      </svg>
    ),
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4ZM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 14.8A2.8 2.8 0 0 0 12 9.2ZM18 6.2a1 1 0 1 1 0 2a1 1 0 0 1 0-2Z"
        />
      </svg>
    ),
  },
];

export default function SocialFollow() {
  const links = getSocialLinks();

  return (
    <section className="relative py-16 md:py-20 bg-gray-50 overflow-hidden">
      {/* Micro-noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 text-center">
        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-400 font-medium mb-6">
          Follow RunPayway&#8482;
        </p>

        <div className="flex items-center justify-center gap-4">
          {SOCIAL_ITEMS.map((item) => (
            <a
              key={item.key}
              href={links[item.key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 text-gray-500 hover:text-navy-900 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
