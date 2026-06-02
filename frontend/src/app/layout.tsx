import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Autonomous Business Builder — AI-Powered Business Strategy",
  description:
    "Transform your business idea into a complete business package in minutes. Market research, branding, content, sales strategy, and analytics — all powered by AI agents.",
  keywords: "AI business builder, startup strategy, market research AI, business plan generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0A0A0F] text-white antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
