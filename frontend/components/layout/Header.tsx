import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/RunPayway/images/logo.png"
            alt="RunPayway"
            width={180}
            height={36}
          />
        </Link>
        <Link
          href="/reference-guide"
          className="text-sm text-gray-600 hover:text-navy-900 transition-colors"
        >
          Reference Guide
        </Link>
      </div>
    </header>
  );
}
