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
  title: "RunPayway™ — Complex-Income Measurement Infrastructure",
  description:
    "RunPayway™ is the governed standard for complex-income measurement. It helps organizations measure income structure consistently — applying approved rules, testing changes with the Measurement Impact Simulator, replaying past measurements, and publishing approved, external-safe outputs to connected systems.",
  verification: {
    google: "5m6xwNlo1Wihest8Qlgi8TEClC93pxwzzTdiMLsH4ZA",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    title: "RunPayway™ — Complex-Income Measurement Infrastructure",
    description: "The governed standard for measuring income structure consistently when business decisions depend on it — approved rules, approved outputs, connected systems.",
    siteName: "RunPayway",
    type: "website",
    images: [
      {
        url: "https://runpayway.peoplestar.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RunPayway™ — Complex-Income Measurement Infrastructure",
    description: "The governed standard for complex-income measurement. Approved rules, external-safe outputs, connected systems.",
    images: ["https://runpayway.peoplestar.com/og-image.png"],
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:wght@400;600&display=swap"
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
              url: "https://runpayway.peoplestar.com",
              description:
                "RunPayway\u2122 is Enterprise Complex-Income Measurement Infrastructure. It helps organizations measure income structure consistently by applying approved rules, testing changes before launch, replaying past measurements, and publishing approved outputs to connected systems.",
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
            navigator.serviceWorker.register('/sw.js').catch(() => {});
          }
        ` }} />
        <Providers>{children}</Providers>
        <AnalyticsPixels />
      </body>
    </html>
  );
}
