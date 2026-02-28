import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUNPAYWAY™",
  description: "Structural Income Classification — Model RP-1.0 | Version 1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 min-h-screen">{children}</body>
    </html>
  );
}
