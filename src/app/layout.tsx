import type { Metadata } from "next";
import "./globals.css";

import { Unbounded } from "next/font/google";
import { Manrope } from "next/font/google";

const unbounded = Unbounded({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-unbounded",
  weight: "400",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Looom form",
  description: "My Looom form",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${unbounded.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
