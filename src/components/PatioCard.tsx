'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Dog, Flame, Umbrella, Sunset, Star, ChevronRight, ExternalLink } from 'lucide-react';
import { Patio } from '@/data/patios';
import { cn, getTodayHours, isOpenNow, getNeighborhoodColor, getLastVisited, formatLastVisited } from '@/lib/utils';
import { calculatePatioWeatherScore, WeatherData } from '@/lib/weather';

interface PatioCardProps {
  patio: Patio;
  weather?: WeatherData | null;
}

export function PatioCard({ patio, weather }: PatioCardProps) {
  const [lastVisited, setLastVisited] = useState<Date | null>(null);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    setLastVisited(getLastVisited(patio.id));
  }, [patio.id]);

  const open = isOpenNow(patio.hours);
  const hours = getTodayHours(patio.hours);
  
  // Calculate patio-specific weather consideration
  const weatherConsideration = weather ? calculatePatioWeatherScore(weather) : null;
  
  // Determine if this patio is good for current weather
  const isGoodForWeather = weatherConsideration && (
    (weatherConsideration.score < 50 && (patio.features.heated || patio.features.covered)) ||
    (weatherConsideration.score >= 70)
  );

  // Generate a placeholder image URL using picsum for demo
  const imageUrl = imageError 
    ? `https://picsum.photos/seed/${patio.id}/600/400` 
    : `/api/placeholder/patio/${patio.id}`;

  return (
    <Link href={`/patio/${patio.slug}`}>
      <div className="group bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div 
            className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fcd34d 100%)`
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🌿</div>
              <p className="text-amber-700/60 text-sm font-medium">{patio.name}</p>
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {open && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                Open Now
              </span>
            )}
            {patio.hiddenGem && (
              <span className="bg-purple-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                Hidden Gem
              </span>
            )}
            {isGoodForWeather && weatherConsideration && weatherConsideration.score < 50 && (
              <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                Weather-Smart
              </span>
            )}
          </div>
          
          {patio.features.sunsetView && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sunset className="w-3 h-3" />
              Sunset Spot
            </div>
          )}

          {/* Last visited badge */}
          {lastVisited && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              Visited {formatLastVisited(lastVisited)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors">
                {patio.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getNeighborhoodColor(patio.neighborhood))}>
                  {patio.neighborhood}
                </span>
                <span className="text-gray-400 text-sm">{patio.priceRange}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors" />
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {patio.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-3">
            {patio.features.heated && (
              <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                <Flame className="w-3 h-3" /> Heated
              </span>
            )}
            {patio.features.covered && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                <Umbrella className="w-3 h-3" /> Covered
              </span>
            )}
            {patio.features.dogFriendly && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <Dog className="w-3 h-3" /> Dog-Friendly
              </span>
            )}
            {patio.yearRound && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                ❄️ Year-Round
              </span>
            )}
          </div>

          {/* Hours & Location */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className={open ? 'text-green-600 font-medium' : ''}>{hours}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[120px]">{patio.neighborhood}</span>
            </div>
          </div>

          {/* Cuisines */}
          <div className="mt-3 flex flex-wrap gap-1">
            {patio.cuisine.slice(0, 2).map((c, i) => (
              <span key={i} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}