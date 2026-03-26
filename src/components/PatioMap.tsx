'use client';

import { useState } from 'react';
import { MapPin, X, Navigation } from 'lucide-react';
import { Patio } from '@/data/patios';
import { cn } from '@/lib/utils';

interface PatioMapProps {
  patios: Patio[];
  selectedPatio: Patio | null;
  onSelectPatio: (patio: Patio | null) => void;
}

export function PatioMap({ patios, selectedPatio, onSelectPatio }: PatioMapProps) {
  // Calgary center coordinates
  const mapCenter = { lat: 51.0447, lng: -114.0719 };
  
  // Simple SVG-based map visualization
  // In production, you'd use Google Maps, Mapbox, or Leaflet
  const mapBounds = {
    minLat: 51.02,
    maxLat: 51.08,
    minLng: -114.12,
    maxLng: -114.02
  };

  const latToY = (lat: number) => {
    return ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
  };

  const lngToX = (lng: number) => {
    return ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-amber-50 to-green-50 rounded-2xl overflow-hidden border border-amber-100">
      {/* Map background with Calgary neighborhoods */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* River */}
        <path
          d="M 0,40 Q 20,35 40,45 T 80,40 T 100,50"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
        <path
          d="M 30,100 Q 40,70 50,60 T 70,50"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        
        {/* Neighborhood areas (simplified) */}
        <rect x="30" y="20" width="25" height="20" fill="#fbbf24" fillOpacity="0.1" rx="2" />
        <rect x="55" y="25" width="20" height="25" fill="#f97316" fillOpacity="0.1" rx="2" />
        <rect x="20" y="40" width="30" height="20" fill="#22c55e" fillOpacity="0.1" rx="2" />
        <rect x="50" y="50" width="25" height="20" fill="#8b5cf6" fillOpacity="0.1" rx="2" />
        <rect x="75" y="35" width="20" height="25" fill="#06b6d4" fillOpacity="0.1" rx="2" />
        
        {/* Neighborhood labels */}
        <text x="42" y="30" className="text-[3px] fill-amber-600 font-medium">Downtown</text>
        <text x="62" y="38" className="text-[3px] fill-orange-600 font-medium">Beltline</text>
        <text x="32" y="50" className="text-[3px] fill-green-600 font-medium">Kensington</text>
        <text x="58" y="60" className="text-[3px] fill-purple-600 font-medium">Mission</text>
        <text x="80" y="48" className="text-[3px] fill-cyan-600 font-medium">Inglewood</text>
      </svg>

      {/* Patio markers */}
      {patios.map((patio) => {
        const x = lngToX(patio.coordinates.lng);
        const y = latToY(patio.coordinates.lat);
        const isSelected = selectedPatio?.id === patio.id;

        return (
          <button
            key={patio.id}
            onClick={() => onSelectPatio(patio)}
            className={cn(
              'absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200',
              isSelected ? 'scale-125 z-20' : 'hover:scale-110'
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shadow-lg',
              isSelected 
                ? 'bg-amber-500 ring-4 ring-amber-200' 
                : 'bg-white hover:bg-amber-100 border-2 border-amber-300'
            )}>
              <MapPin className={cn(
                'w-5 h-5',
                isSelected ? 'text-white' : 'text-amber-600'
              )} />
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-amber-100">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Neighborhoods</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" /> Downtown</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full" /> Beltline</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full" /> Kensington</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-400 rounded-full" /> Mission</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-400 rounded-full" /> Inglewood</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-pink-400 rounded-full" /> Ramsay</span>
        </div>
      </div>

      {/* Selected patio popup */}
      {selectedPatio && (
        <div className="absolute top-4 right-4 w-72 bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden z-30">
          <div className="relative h-32 bg-gradient-to-br from-amber-100 to-orange-100">
            <button
              onClick={() => onSelectPatio(null)}
              className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <div className="absolute bottom-4 left-4">
              <span className="inline-block px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                {selectedPatio.neighborhood}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-900">{selectedPatio.name}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedPatio.description}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {selectedPatio.features.heated && (
                <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded">🔥 Heated</span>
              )}
              {selectedPatio.features.covered && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">☂️ Covered</span>
              )}
              {selectedPatio.features.dogFriendly && (
                <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">🐕 Dogs OK</span>
              )}
            </div>
            <a
              href={`/patio/${selectedPatio.slug}`}
              className="mt-4 block text-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-xl transition-colors"
            >
              View Details
            </a>
          </div>
        </div>
      )}

      {/* Map attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/60 px-2 py-1 rounded">
        Interactive Map
      </div>
    </div>
  );
}