import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from "gt-next/server";
import { GTProvider } from "gt-next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "CSM Dashboard",
  description: "Customer Success Management Dashboard powered by Metronome",
  generator: 'v0.app'
};

export default async function RootLayout({
  children


}: Readonly<{children: React.ReactNode;}>) {
  return (
  <html className={`${geistSans.variable} ${geistMono.variable}`} lang={await getLocale()}>
      <body className="antialiased"><GTProvider>{children}</GTProvider></body>
    </html>
  );
}