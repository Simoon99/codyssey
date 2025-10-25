import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { base, heading, subheading } from "@/constants/fonts";
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
  title: "Codyssey - Your Gamified Project Journey",
  description: "Build amazing projects with AI helpers guiding your journey from idea to launch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${base.variable} ${heading.variable} ${subheading.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
