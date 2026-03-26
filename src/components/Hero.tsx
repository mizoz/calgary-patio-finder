'use client';

import { useEffect, useState } from 'react';
import { Sun, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { getPatioSeasonCountdown } from '@/lib/weather';

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const patioSeason = getPatioSeasonCountdown();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 min-h-[60vh] sm:min-h-[70vh] flex items-center">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun */}
        <div className="absolute -top-20 right-10 w-80 h-80 bg-yellow-200 rounded-full opacity-60 blur-3xl animate-pulse" />
        <div className="absolute top-20 right-20 w-60 h-60 bg-orange-200 rounded-full opacity-40 blur-2xl" />
        
        {/* Floating decorative leaves */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🌿</div>
        <div className="absolute top-40 right-20 text-4xl opacity-20 animate-float-delayed">🍃</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-float-slow">🌿</div>
        <div className="absolute bottom-20 right-40 text-3xl opacity-20 animate-float">🍃</div>
        <div className="absolute top-60 left-40 text-4xl opacity-15 animate-float-delayed">🌱</div>
        
        {/* Calgary skyline silhouette - simplified */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-500/30 to-transparent" />
        
        {/* Building silhouettes */}
        <svg className="absolute bottom-0 left-0 right-0 h-32 opacity-10" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,100 L0,60 L30,60 L30,40 L50,40 L50,60 L80,60 L80,30 L100,30 L100,50 L130,50 L130,20 L150,20 L150,50 L180,50 L180,35 L200,35 L200,55 L230,55 L230,25 L250,25 L250,55 L280,55 L280,45 L310,45 L310,55 L340,55 L340,15 L360,15 L360,55 L390,55 L390,40 L420,40 L420,55 L450,55 L450,20 L470,20 L470,55 L500,55 L500,30 L520,30 L520,55 L550,55 L550,45 L580,45 L580,55 L610,55 L610,25 L630,25 L630,55 L660,55 L660,35 L690,35 L690,55 L720,55 L720,10 L740,10 L740,55 L770,55 L770,40 L800,40 L800,55 L830,55 L830,30 L850,30 L850,55 L880,55 L880,45 L910,45 L910,55 L940,55 L940,20 L960,20 L960,55 L990,55 L990,35 L1020,35 L1020,55 L1050,55 L1050,25 L1080,25 L1080,55 L1110,55 L1110,40 L1140,40 L1140,55 L1170,55 L1170,50 L1200,50 L1200,100 Z" 
            fill="white" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        {/* Logo/Brand */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="text-5xl">☀️</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
            Calgary Patio Finder
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto font-medium drop-shadow-md">
          Discover the best patios in YYC — where sunshine meets great vibes
        </p>

        {/* Patio Season Countdown */}
        {mounted && (
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 mb-8 border border-white/30">
            <Calendar className="w-6 h-6 text-white" />
            <span className="text-white font-semibold">
              {patioSeason.isPatioSeason ? (
                <>
                  <span className="text-yellow-100">🎉 Patio Season is ON!</span>
                  <span className="ml-2 text-white/80">{patioSeason.days} days left</span>
                </>
              ) : (
                patioSeason.message
              )}
            </span>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <span className="text-2xl font-bold text-white">25+</span>
            <span className="text-white/80 ml-1">Patios</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <span className="text-2xl font-bold text-white">9</span>
            <span className="text-white/80 ml-1">Neighborhoods</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <span className="text-2xl font-bold text-white">☀️</span>
            <span className="text-white/80 ml-1">Real Weather</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#patios"
            className="inline-flex items-center gap-2 bg-white text-amber-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-amber-50 transition-all transform hover:-translate-y-0.5"
          >
            <MapPin className="w-5 h-5" />
            Explore Patios
          </a>
          <a
            href="#hidden-gems"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all"
          >
            <Sun className="w-5 h-5" />
            Hidden Gems
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </div>
    </div>
  );
}