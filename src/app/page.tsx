import { Metadata } from 'next';
import { HomeClient } from './HomeClient';

export const metadata: Metadata = {
  title: 'Calgary Patio Finder | Discover the Best Patios in YYC',
  description: 'Find the best patios in Calgary with real-time weather scores, filters for heated and dog-friendly spots, and discover hidden gems across the city.',
  keywords: 'Calgary, patios, YYC, outdoor dining, restaurants, patios Calgary, best patios Calgary, patio weather',
  openGraph: {
    title: 'Calgary Patio Finder',
    description: 'Discover the best patios in Calgary with real-time weather tracking and curated recommendations.',
    type: 'website',
    locale: 'en_CA',
    siteName: 'Calgary Patio Finder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calgary Patio Finder',
    description: 'Find the best patios in Calgary with real-time weather tracking.',
  },
};

export default function HomePage() {
  return <HomeClient />;
}