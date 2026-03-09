import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RunPayway™ Income Stability Assessment",
  description:
    "Income Stability Score™ Structural Income Classification — Model RP-1.0 | Version 1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold tracking-wide text-neutral-900">
                RUNPAYWAY™
              </span>
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
      </body>
    </html>
  );
}
