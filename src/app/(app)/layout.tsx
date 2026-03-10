import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold tracking-wide text-neutral-900 hover:opacity-70 transition-opacity cursor-pointer">
              RUNPAYWAY™
            </Link>
          </div>
          <div className="text-xs text-neutral-400">
            RP-1.0 | Version 1.0
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6 text-xs text-neutral-400">
          RunPayway™ Income Stability Assessment — Model RP-1.0 | Version 1.0
        </div>
      </footer>
    </div>
  );
}
