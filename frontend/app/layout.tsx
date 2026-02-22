import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RunPayway\u2122 \u2014 The Standard for Revenue Exposure",
  description:
    "RunPayway issues a formal Payway Rating that shows whether your income runs on systems or on you. One-time structural diagnostic. Immediate formal report.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
