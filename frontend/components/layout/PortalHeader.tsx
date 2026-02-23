import Link from "next/link";

export default function PortalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/RunPayway/images/logo.png"
            alt="RunPayway"
            width={180}
            height={36}
          />
        </Link>
      </div>
    </header>
  );
}
