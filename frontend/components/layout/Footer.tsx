import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="text-sm text-gray-400">
            <p>&copy; 2026 RunPayway&#8482;</p>
            <p className="mt-1">Operated by PeopleStar Enterprises, Inc.</p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <span className="text-gray-600" aria-hidden="true">&middot;</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span className="text-gray-600" aria-hidden="true">&middot;</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600" aria-hidden="true">&middot;</span>
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-gray-600" aria-hidden="true">&middot;</span>
            <Link href="/reference-guide" className="hover:text-white transition-colors">
              Reference Guide
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
