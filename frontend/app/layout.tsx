import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RunPayway\u2122 \u2014 The Standard for Income Structure Diagnostics\u2122",
  description:
    "RunPayway is the structural revenue dependency measurement platform. Expose how organizations actually generate, concentrate, and risk their income.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        <Header />
        <div className="pt-16 flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
