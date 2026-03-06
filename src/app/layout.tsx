import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RUNPAYWAY\u2122",
  description: "Income Stability. Structurally Measured.",
};

function Header() {
  return (
    <header className="border-b border-divider">
      <div className="mx-auto max-w-[1280px] px-10 flex items-center justify-between h-16">
        <Link href="/" className="text-navy font-semibold text-lg tracking-tight">
          RUNPAYWAY&trade;
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy">
          <Link href="/welcome" className="hover:opacity-70">Get Score</Link>
          <Link href="/pricing" className="hover:opacity-70">Pricing</Link>
          <Link href="/#methodology" className="hover:opacity-70">Methodology</Link>
          <Link href="/verify" className="hover:opacity-70">Registry</Link>
          <Link href="/pricing" className="hover:opacity-70">Enterprise</Link>
          <Link href="/welcome" className="hover:opacity-70">Sign In</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-divider mt-24">
      <div className="mx-auto max-w-[1280px] px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
          <div>
            <p className="font-semibold text-navy mb-4">Product</p>
            <div className="flex flex-col gap-2 text-secondary">
              <Link href="/welcome" className="hover:opacity-70">Get Score</Link>
              <Link href="/pricing" className="hover:opacity-70">Pricing</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-navy mb-4">Methodology</p>
            <div className="flex flex-col gap-2 text-secondary">
              <Link href="/" className="hover:opacity-70">Governance</Link>
              <Link href="/" className="hover:opacity-70">Version Control</Link>
              <Link href="/" className="hover:opacity-70">Data Retention</Link>
              <Link href="/" className="hover:opacity-70">Security Practices</Link>
              <Link href="/" className="hover:opacity-70">Immutability Policy</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-navy mb-4">Legal</p>
            <div className="flex flex-col gap-2 text-secondary">
              <Link href="/" className="hover:opacity-70">Terms</Link>
              <Link href="/" className="hover:opacity-70">Privacy</Link>
              <Link href="/" className="hover:opacity-70">Disclaimer</Link>
              <Link href="/" className="hover:opacity-70">Acceptable Use</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-navy mb-4">Institutional</p>
            <div className="flex flex-col gap-2 text-secondary">
              <Link href="/verify" className="hover:opacity-70">Registry</Link>
              <Link href="/" className="hover:opacity-70">Accessibility</Link>
              <Link href="/" className="hover:opacity-70">Contact</Link>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-secondary">
          <div className="flex flex-col gap-1">
            <p>&copy; RunPayway&trade;</p>
            <p>Model RP-1.0 | Version 1.0</p>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:opacity-70 cursor-pointer">X</span>
            <span className="hover:opacity-70 cursor-pointer">LinkedIn</span>
            <span className="hover:opacity-70 cursor-pointer">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-navy antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
