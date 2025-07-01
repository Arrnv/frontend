import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import jsonLdOrganization from '@/data/StructuredData';
import ClientLayout from './ClientLayout';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Find Services for Truck Drivers & Fleets | TruckNav',
  description: 'Join TruckNav to discover over 450,000 verified service points...',
  metadataBase: new URL('https://your-domain.com'),
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
<body className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB]`}>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
