import type { Metadata } from "next";
import { Geist, Geist_Mono, Great_Vibes } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const script = Great_Vibes({ variable: "--font-script", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Luminary Financial — Compliance Intelligence Platform",
  description: "AI-powered RIA compliance auditing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${script.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
