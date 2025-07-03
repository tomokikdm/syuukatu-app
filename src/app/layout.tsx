import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "就活企業分析アプリ | Syuukatu App",
  description: "企業情報・面接対策をまとめられる就活生向けWebアプリ",
  keywords: ["就活", "企業分析", "面接対策", "Webアプリ", "syuukatu"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="bg-white text-gray-900 dark:bg-black dark:text-white antialiased">
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
