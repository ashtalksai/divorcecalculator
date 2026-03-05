import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Divorce Cost Calculator — Know What to Expect Before You Start",
  description:
    "Get a realistic estimate of your divorce costs in minutes. Attorney fees, court costs, mediation — broken down by best, likely, and worst case scenarios.",
  keywords: "divorce cost calculator, divorce expenses, attorney fees, divorce budget, how much does divorce cost",
  openGraph: {
    title: "Divorce Cost Calculator — Know What to Expect",
    description: "Get a realistic estimate of your divorce costs in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
