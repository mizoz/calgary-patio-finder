'use client';

import { useState, useMemo, useEffect } from 'react';
import { patios } from '@/data/patios';
import { Filters, FilterState } from '@/components/Filters';
import { PatioCard } from '@/components/PatioCard';
import { PatioMap } from '@/components/PatioMap';
import { Hero } from '@/components/Hero';
import { HiddenGems } from '@/components/HiddenGems';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Patio } from '@/data/patios';
import { getCurrentWeather, WeatherData, calculatePatioWeatherScore } from '@/lib/weather';
import { MapPin, List } from 'lucide-react';

export function HomeClient() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedPatio, setSelectedPatio] = useState<Patio | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    neighborhood: 'All',
    heated: false,
    covered: false,
    dogFriendly: false,
    sunsetView: false,
    sunnyNow: false,
    openNow: false,
    hiddenGems: false
  });

  useEffect(() => {
    async function fetchWeather() {
      const data = await getCurrentWeather();
      setWeather(data);
      setLoading(false);
    }
    fetchWeather();
  }, []);

  // Calculate if it's sunny right now
  const sunnyNowAvailable = weather ? calculatePatioWeatherScore(weather).sunnyNow : false;

  // Filter patios based on current filters
  const filteredPatios = useMemo(() => {
    return patios.filter(patio => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !patio.name.toLowerCase().includes(searchLower) &&
          !patio.description.toLowerCase().includes(searchLower) &&
          !patio.neighborhood.toLowerCase().includes(searchLower) &&
          !patio.cuisine.some(c => c.toLowerCase().includes(searchLower))
        ) {
          return false;
        }
      }

      // Neighborhood filter
      if (filters.neighborhood !== 'All' && patio.neighborhood !== filters.neighborhood) {
        return false;
      }

      // Feature filters
      if (filters.heated && !patio.features.heated) return false;
      if (filters.covered && !patio.features.covered) return false;
      if (filters.dogFriendly && !patio.features.dogFriendly) return false;
      if (filters.sunsetView && !patio.features.sunsetView) return false;

      // Sunny now filter - show patios good for sunny weather
      if (filters.sunnyNow && sunnyNowAvailable) {
        // In sunny weather, show all uncovered patios or those with outdoor appeal
        if (!patio.features.covered && !patio.features.sunsetView) return false;
      }

      // Open now filter
      if (filters.openNow) {
        const now = new Date();
        const dayMap: Record<number, string> = {
          0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'
        };
        const today = dayMap[now.getDay()];
        const todayHours = patio.hours[today];
        
        if (!todayHours || todayHours.closed) return false;
        
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [openHour, openMin] = todayHours.open.split(':').map(Number);
        const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
        
        const openTime = openHour * 60 + openMin;
        let closeTime = closeHour * 60 + closeMin;
        
        if (closeTime < openTime) {
          closeTime += 24 * 60;
          if (!(currentTime >= openTime || currentTime <= closeTime - 24 * 60)) {
            return false;
          }
        } else {
          if (!(currentTime >= openTime && currentTime <= closeTime)) {
            return false;
          }
        }
      }

      // Hidden gems filter
      if (filters.hiddenGems && !patio.hiddenGem) return false;

      return true;
    });
  }, [filters, sunnyNowAvailable]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div id="patios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather Widget - Mobile prominent */}
        <div className="lg:hidden mb-6">
          <WeatherWidget />
        </div>

        {/* Filters */}
        <Filters
          filters={filters}
          onFilterChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sunnyNowAvailable={sunnyNowAvailable}
        />

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredPatios.length}</span>
            {' '}patios found
          </p>
          {loading && (
            <span className="text-sm text-amber-600 animate-pulse">Loading weather...</span>
          )}
        </div>

        {/* View Mode: Grid or Map */}
        {viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatios.map(patio => (
              <PatioCard key={patio.id} patio={patio} weather={weather} />
            ))}
          </div>
        ) : (
          <PatioMap
            patios={filteredPatios}
            selectedPatio={selectedPatio}
            onSelectPatio={setSelectedPatio}
          />
        )}

        {/* No results */}
        {filteredPatios.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No patios found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={() => setFilters({
                search: '',
                neighborhood: 'All',
                heated: false,
                covered: false,
                dogFriendly: false,
                sunsetView: false,
                sunnyNow: false,
                openNow: false,
                hiddenGems: false
              })}
              className="text-amber-600 hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Hidden Gems Section */}
      <HiddenGems patios={patios} />

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Calgary Patio Finder</h3>
              <p className="text-amber-200 text-sm">
                Discover the best patios in YYC with real-time weather tracking and curated recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#patios" className="hover:text-white transition-colors">All Patios</a></li>
                <li><a href="#hidden-gems" className="hover:text-white transition-colors">Hidden Gems</a></li>
                <li><a href="https://github.com/mizoz/calgary-patio-finder" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">About Calgary Patios</h4>
              <p className="text-amber-200 text-sm">
                Patio season in Calgary typically runs from May long weekend through September. 
                Many spots offer heated patios year-round for the dedicated!
              </p>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-300">
            <p>Made with ☀️ in Calgary, AB</p>
            <p className="mt-2">MIT License © 2024</p>
          </div>
        </div>
      </footer>
    </main>
  );
}