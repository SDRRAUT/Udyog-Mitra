import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UDYOG MITRA | Government of Maharashtra Single Window Industrial Clearances",
  description: "Unified AI-Powered Industrial Approval, Compliance & Government Support SaaS Platform for Maharashtra (Problem ID: 26130)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)] font-sans antialiased selection:bg-[var(--primary-100)] selection:text-[var(--primary-900)]">
        {children}
      </body>
    </html>
  );
}
