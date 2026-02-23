import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      {/* Top divider */}
      <div className="border-t border-gray-300" />

      <div className="bg-navy-900" style={{ paddingTop: "96px", paddingBottom: "72px" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Desktop: two columns / Mobile: stacked */}
          <div className="flex flex-col md:flex-row md:justify-between gap-12">

            {/* LEFT COLUMN — Identity */}
            <div className="space-y-3 text-sm leading-[1.6]">
              <p className="text-white font-semibold">RunPayway&#8482;</p>
              <p className="text-gray-400">The Standard for Revenue Exposure.</p>
              <p className="text-gray-400">
                Structural measurement for income continuity.
              </p>
              <div className="pt-4 space-y-1 text-gray-500 text-xs">
                <p>&copy; 2026 RunPayway&#8482;</p>
                <p>A product of PeopleStar Enterprises, Inc.</p>
                <p>All rights reserved.</p>
              </div>
              <p className="text-gray-500 text-xs pt-2">
                Structural standards remain version-controlled and documented.
              </p>
            </div>

            {/* RIGHT COLUMN — Governance & Access */}
            <div className="flex flex-col sm:flex-row gap-10 md:gap-16">

              {/* Framework */}
              <div className="space-y-2.5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                  Framework
                </p>
                <p className="text-gray-400 text-sm">Model Version: RP-1.0</p>
                <Link
                  href="/standard"
                  className="block text-gray-400 text-sm hover:underline"
                >
                  Standards Documentation
                </Link>
                <Link
                  href="/standard"
                  className="block text-gray-400 text-sm hover:underline"
                >
                  RunPayway&#8482; Structural Standard
                </Link>
              </div>

              {/* Legal */}
              <div className="space-y-2.5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                  Legal
                </p>
                <Link
                  href="/terms"
                  className="block text-gray-400 text-sm hover:underline"
                >
                  Terms of Use
                </Link>
                <Link
                  href="/privacy"
                  className="block text-gray-400 text-sm hover:underline"
                >
                  Privacy Policy
                </Link>
              </div>

              {/* Company */}
              <div className="space-y-2.5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                  Company
                </p>
                <Link
                  href="/contact"
                  className="block text-gray-400 text-sm hover:underline"
                >
                  Contact
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
