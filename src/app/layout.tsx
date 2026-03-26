import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Calgary Patio Finder | Discover the Best Patios in YYC",
    template: "%s | Calgary Patio Finder",
  },
  description: "Find the best patios in Calgary with real-time weather scores, filters for heated and dog-friendly spots, and discover hidden gems across the city.",
  keywords: ["Calgary", "patios", "YYC", "outdoor dining", "restaurants", "patio weather"],
  authors: [{ name: "Calgary Patio Finder" }],
  creator: "Calgary Patio Finder",
  metadataBase: new URL("https://calgary-patio-finder.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://calgary-patio-finder.vercel.app",
    siteName: "Calgary Patio Finder",
    title: "Calgary Patio Finder",
    description: "Discover the best patios in Calgary with real-time weather tracking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calgary Patio Finder",
    description: "Find the best patios in Calgary with real-time weather tracking.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-amber-50`}
      >
        {children}
      </body>
    </html>
  );
}