'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  MapPin, Clock, Phone, Globe, ArrowLeft, 
  Dog, Flame, Umbrella, Sunset, Music, Utensils, Wine,
  Calendar, Share2, Heart, ExternalLink, Star
} from 'lucide-react';
import { patios, Patio } from '@/data/patios';
import { cn, getTodayHours, isOpenNow, getNeighborhoodColor, getLastVisited, setLastVisited, formatLastVisited } from '@/lib/utils';
import { WeatherWidget } from './WeatherWidget';
import { PatioCard } from './PatioCard';

interface PatioDetailProps {
  slug: string;
}

export function PatioDetail({ slug }: PatioDetailProps) {
  const patio = patios.find(p => p.slug === slug);
  const [lastVisited, setLastVisitedState] = useState<Date | null>(null);
  const [showVisitedModal, setShowVisitedModal] = useState(false);

  useEffect(() => {
    if (patio) {
      setLastVisitedState(getLastVisited(patio.id));
    }
  }, [patio]);

  if (!patio) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Patio not found</h1>
          <Link href="/" className="text-amber-600 hover:underline">← Back to all patios</Link>
        </div>
      </div>
    );
  }

  const open = isOpenNow(patio.hours);
  const hours = getTodayHours(patio.hours);

  const handleMarkVisited = () => {
    setLastVisited(patio.id);
    setLastVisitedState(new Date());
    setShowVisitedModal(false);
  };

  // Get similar patios (same neighborhood or similar features)
  const similarPatios = patios
    .filter(p => p.id !== patio.id && (
      p.neighborhood === patio.neighborhood ||
      p.features.dogFriendly === patio.features.dogFriendly ||
      p.features.sunsetView === patio.features.sunsetView
    ))
    .slice(0, 3);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🌿</div>
            <p className="text-amber-700/60 text-lg">{patio.name}</p>
          </div>
        </div>
        
        {/* Back button */}
        <Link 
          href="/"
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-gray-700 hover:bg-white transition-colors shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {open && (
            <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg">
              Open Now
            </span>
          )}
          {patio.hiddenGem && (
            <span className="bg-purple-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg">
              Hidden Gem
            </span>
          )}
        </div>

        {/* Neighborhood badge */}
        <div className="absolute bottom-4 left-4">
          <span className={cn('text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg', getNeighborhoodColor(patio.neighborhood))}>
            {patio.neighborhood}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{patio.name}</h1>
                <span className="text-2xl text-amber-600">{patio.priceRange}</span>
              </div>
              <p className="text-gray-600 mt-1">{patio.cuisine.join(' • ')}</p>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed">{patio.description}</p>

            {/* Features Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Patio Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <FeatureItem 
                  icon={<Flame className="w-5 h-5" />} 
                  label="Heated" 
                  active={patio.features.heated}
                  activeColor="orange"
                />
                <FeatureItem 
                  icon={<Umbrella className="w-5 h-5" />} 
                  label="Covered" 
                  active={patio.features.covered}
                  activeColor="blue"
                />
                <FeatureItem 
                  icon={<Dog className="w-5 h-5" />} 
                  label="Dog-Friendly" 
                  active={patio.features.dogFriendly}
                  activeColor="green"
                />
                <FeatureItem 
                  icon={<Sunset className="w-5 h-5" />} 
                  label="Sunset Views" 
                  active={patio.features.sunsetView}
                  activeColor="pink"
                />
                <FeatureItem 
                  icon={<Music className="w-5 h-5" />} 
                  label="Live Music" 
                  active={patio.features.hasLive}
                  activeColor="purple"
                />
                <FeatureItem 
                  icon={<Utensils className="w-5 h-5" />} 
                  label="Full Menu" 
                  active={patio.features.servesFood}
                  activeColor="amber"
                />
                <FeatureItem 
                  icon={<Wine className="w-5 h-5" />} 
                  label="Cocktails" 
                  active={patio.features.servesCocktails}
                  activeColor="rose"
                />
                <FeatureItem 
                  icon={<Calendar className="w-5 h-5" />} 
                  label="Reservations" 
                  active={patio.features.reservations}
                  activeColor="cyan"
                />
                <FeatureItem 
                  icon="❄️" 
                  label="Year-Round" 
                  active={patio.yearRound}
                  activeColor="indigo"
                />
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hours</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(patio.hours).map(([day, hours]) => {
                  const today = new Date().getDay();
                  const dayIndex = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(day);
                  const isToday = dayIndex === today;
                  
                  return (
                    <div 
                      key={day} 
                      className={cn(
                        'p-3 rounded-xl text-center',
                        isToday ? 'bg-amber-50 border-2 border-amber-300' : 'bg-gray-50'
                      )}
                    >
                      <p className={cn(
                        'text-sm font-medium capitalize',
                        isToday ? 'text-amber-700' : 'text-gray-600'
                      )}>
                        {dayNames[dayIndex]}
                        {isToday && <span className="ml-1">•</span>}
                      </p>
                      <p className={cn(
                        'text-sm mt-1',
                        hours.closed ? 'text-red-500' : isToday ? 'text-amber-900 font-medium' : 'text-gray-900'
                      )}>
                        {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {patio.highlights.map((highlight, i) => (
                  <span 
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm"
                  >
                    <Star className="w-4 h-4" />
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* Location & Contact */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location & Contact</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{patio.address}</p>
                    <p className="text-gray-500 text-sm">{patio.neighborhood}, Calgary, AB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <a href={`tel:${patio.phone}`} className="text-amber-600 hover:underline">
                    {patio.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-amber-500" />
                  <a 
                    href={patio.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:underline inline-flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                {patio.instagram && (
                  <div className="flex items-center gap-3">
                    <span className="text-pink-500 font-bold text-lg">IG</span>
                    <a 
                      href={`https://instagram.com/${patio.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline inline-flex items-center gap-1"
                    >
                      @{patio.instagram}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Weather & Actions */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(patio.address + ', Calgary, AB')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Get Directions
                </a>
                {patio.features.reservations && (
                  <a
                    href={patio.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-medium py-3 rounded-xl transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    Make Reservation
                  </a>
                )}
                <button
                  onClick={() => setShowVisitedModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-xl transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  {lastVisited ? `Visited ${formatLastVisited(lastVisited)}` : 'Mark as Visited'}
                </button>
              </div>
            </div>

            {/* Last Visited */}
            {lastVisited && (
              <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                <p className="text-green-700 text-sm">
                  ✓ You last visited on {lastVisited.toLocaleDateString('en-CA', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Similar Patios */}
        {similarPatios.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarPatios.map(similarPatio => (
                <PatioCard key={similarPatio.id} patio={similarPatio} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visited Modal */}
      {showVisitedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Mark as Visited?</h3>
            <p className="text-gray-600 mb-4">
              This will be saved locally on your device. Great for tracking your patio adventures!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowVisitedModal(false)}
                className="flex-1 py-2 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkVisited}
                className="flex-1 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureItem({ 
  icon, 
  label, 
  active, 
  activeColor 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean;
  activeColor: string;
}) {
  const activeColors: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };

  return (
    <div className={cn(
      'flex items-center gap-2 p-3 rounded-xl border transition-colors',
      active 
        ? activeColors[activeColor] 
        : 'bg-gray-50 text-gray-400 border-gray-100'
    )}>
      {typeof icon === 'string' ? <span className="text-lg">{icon}</span> : icon}
      <span className="text-sm font-medium">{label}</span>
      {active && <span className="ml-auto text-green-500">✓</span>}
    </div>
  );
}