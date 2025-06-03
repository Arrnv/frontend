// app/layout.tsx or RootLayout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import jsonLdOrganization from '@/data/StructuredData';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find Services for Truck Drivers & Fleets | TruckNav",
  description: "Join TruckNav to discover over 450,000 verified service points for truck drivers and fleet managers across the USA.",
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "Find Services for Truck Drivers & Fleets | TruckNav",
    description:
      "Explore 450K+ trusted service locations for truckers nationwide through TruckNav’s innovative and feature-rich platform.",
    url: "https://your-domain.com",
    siteName: "TruckNav",
    images: [
      {
        url: "/main-img.webp",
        width: 800,
        height: 600,
        alt: "Map with 450,000 service points",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
