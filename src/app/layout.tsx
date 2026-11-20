import type { Metadata } from "next";
import { Anybody, Figtree, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-spline-sans-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ATELIER KINETA — Industrial Objects Gallery",
  description:
    "Kinetic motion object gallery powered by Framer Motion shared-element transitions, scroll-linked typography, 3D tilt cards, URL-synced filters, and spring cart checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anybody.variable} ${figtree.variable} ${splineSansMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone text-obsidian">
        {children}
      </body>
    </html>
  );
}
