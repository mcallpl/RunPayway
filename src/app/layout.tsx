import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import AnalyticsPixels from "@/components/AnalyticsPixels";
import ErrorReporter from "@/components/ErrorReporter";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "RunPayway™ — Income Stability Score",
  description:
    "Measure how stable your income structure actually is. Six questions. 90 seconds. Deterministic scoring. Built for consultants, contractors, freelancers, and business owners.",
  openGraph: {
    title: "RunPayway™ — Income Stability Score",
    description: "The structural assessment that reveals income weakness before disruption makes it obvious.",
    siteName: "RunPayway",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RunPayway™ — Income Stability Score",
    description: "Measure how stable your income structure actually is. Deterministic scoring.",
  },
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "RunPayway\u2122",
              url: "https://peoplestar.com/RunPayway",
              description:
                "RunPayway measures how stable your income structure actually is. Deterministic scoring built for consultants, contractors, freelancers, and business owners.",
              brand: {
                "@type": "Brand",
                name: "RunPayway\u2122",
              },
            }),
          }}
        />
        <ErrorReporter />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/RunPayway/sw.js').catch(() => {});
          }
        ` }} />
        <Providers>{children}</Providers>
        <AnalyticsPixels />
      </body>
    </html>
  );
}
