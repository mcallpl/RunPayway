"use client";

import Link from "next/link";

interface StandardHeaderProps {
  onMenuToggle: () => void;
  menuOpen: boolean;
}

export default function StandardHeader({
  onMenuToggle,
  menuOpen,
}: StandardHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="h-16 px-6 flex items-center justify-between max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-navy-900"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {menuOpen ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <>
                  <path d="M3 5h14" />
                  <path d="M3 10h14" />
                  <path d="M3 15h14" />
                </>
              )}
            </svg>
          </button>

          <Link
            href="/"
            className="text-[14px] font-medium text-[#0B1F2E] hover:underline"
          >
            &larr; Back to RunPayway&#8482;
          </Link>
        </div>

        <span className="text-gray-400 text-xs tracking-wide hidden sm:block">
          Model Version RP-1.0
        </span>
      </div>
    </header>
  );
}
