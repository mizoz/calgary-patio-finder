import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { patios } from '@/data/patios';
import { PatioDetail } from '@/components/PatioDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return patios.map((patio) => ({
    slug: patio.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const patio = patios.find(p => p.slug === resolvedParams.slug);
  
  if (!patio) {
    return {
      title: 'Patio Not Found | Calgary Patio Finder',
    };
  }

  return {
    title: `${patio.name} | Calgary Patio Finder`,
    description: patio.description,
    openGraph: {
      title: `${patio.name} - Calgary Patio`,
      description: patio.description,
      type: 'website',
      locale: 'en_CA',
      siteName: 'Calgary Patio Finder',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${patio.name} - Calgary Patio`,
      description: patio.description,
    },
  };
}

export default async function PatioPage({ params }: PageProps) {
  const resolvedParams = await params;
  const patio = patios.find(p => p.slug === resolvedParams.slug);
  
  if (!patio) {
    notFound();
  }

  return <PatioDetail slug={resolvedParams.slug} />;
}