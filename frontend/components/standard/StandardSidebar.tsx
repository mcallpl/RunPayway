"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STANDARD_NAV } from "@/lib/standard-nav";

interface StandardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function StandardSidebar({ open, onClose }: StandardSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const normalized = pathname.replace(/\/$/, "");
    const target = href.replace(/\/$/, "");
    return normalized === target;
  };

  const nav = (
    <nav className="py-6 pr-4">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400 px-4 mb-4">
        RunPayway&#8482; Structural Standard
      </p>
      <ul className="space-y-0.5">
        {STANDARD_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClose}
              className={`block px-4 py-2 text-sm transition-colors ${
                isActive(item.href)
                  ? "text-navy-900 font-medium bg-gray-50"
                  : "text-gray-500 hover:text-navy-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] shrink-0 border-r border-gray-100 overflow-y-auto h-full">
        {nav}
      </aside>

      {/* Mobile drawer overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={onClose}
          />
          <aside className="fixed top-16 left-0 bottom-0 z-50 w-[280px] bg-white border-r border-gray-200 overflow-y-auto lg:hidden animate-slide-in-left">
            {nav}
          </aside>
        </>
      )}
    </>
  );
}
