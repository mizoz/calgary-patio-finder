'use client';

import { Sparkles, MapPin } from 'lucide-react';
import { Patio } from '@/data/patios';
import { PatioCard } from './PatioCard';

interface HiddenGemsProps {
  patios: Patio[];
}

export function HiddenGems({ patios }: HiddenGemsProps) {
  const hiddenGems = patios.filter(p => p.hiddenGem);

  if (hiddenGems.length === 0) return null;

  return (
    <section id="hidden-gems" className="py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Local Favorites
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Hidden Gems
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover Calgary's best-kept patio secrets. These spots are loved by locals but might not be on every tourist's radar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hiddenGems.map(patio => (
            <div key={patio.id} className="relative">
              <PatioCard patio={patio} />
              <div className="absolute -top-2 -right-2 bg-purple-500 text-white p-2 rounded-full shadow-lg">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            💡 Pro tip: These spots fill up fast during patio season — arrive early or make reservations!
          </p>
        </div>
      </div>
    </section>
  );
}