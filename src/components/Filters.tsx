'use client';

import { useState } from 'react';
import { Search, X, Sun, Flame, Umbrella, Dog, Sunset, Map, List, Filter } from 'lucide-react';
import { neighborhoods } from '@/data/patios';
import { cn } from '@/lib/utils';

export interface FilterState {
  search: string;
  neighborhood: string;
  heated: boolean;
  covered: boolean;
  dogFriendly: boolean;
  sunsetView: boolean;
  sunnyNow: boolean;
  openNow: boolean;
  hiddenGems: boolean;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
  sunnyNowAvailable?: boolean;
}

export function Filters({ 
  filters, 
  onFilterChange, 
  viewMode, 
  onViewModeChange,
  sunnyNowAvailable = false 
}: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
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
  };

  const hasActiveFilters = 
    filters.search || 
    filters.neighborhood !== 'All' || 
    filters.heated || 
    filters.covered || 
    filters.dogFriendly || 
    filters.sunsetView ||
    filters.sunnyNow ||
    filters.openNow ||
    filters.hiddenGems;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-4 mb-6 sticky top-4 z-20">
      {/* Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
          <input
            type="text"
            placeholder="Search patios..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-700 placeholder-gray-400"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-3 rounded-xl transition-all',
              viewMode === 'grid' 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' 
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            )}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('map')}
            className={cn(
              'p-3 rounded-xl transition-all',
              viewMode === 'map' 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' 
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            )}
          >
            <Map className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toggle (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'sm:hidden p-3 rounded-xl transition-all flex items-center gap-2',
            hasActiveFilters 
              ? 'bg-amber-500 text-white' 
              : 'bg-amber-50 text-amber-600'
          )}
        >
          <Filter className="w-5 h-5" />
          {hasActiveFilters && <span className="text-xs">Active</span>}
        </button>
      </div>

      {/* Quick Filters - Always visible on desktop, toggle on mobile */}
      <div className={cn('flex flex-wrap gap-2', showFilters ? 'flex' : 'hidden sm:flex')}>
        {/* Sunny Now - Special highlight */}
        {sunnyNowAvailable && (
          <button
            onClick={() => updateFilter('sunnyNow', !filters.sunnyNow)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              filters.sunnyNow
                ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-200'
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            )}
          >
            <Sun className="w-4 h-4" />
            Sunny Right Now
          </button>
        )}

        <button
          onClick={() => updateFilter('heated', !filters.heated)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filters.heated
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
              : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
          )}
        >
          <Flame className="w-4 h-4" />
          Heated
        </button>

        <button
          onClick={() => updateFilter('covered', !filters.covered)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filters.covered
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          )}
        >
          <Umbrella className="w-4 h-4" />
          Covered
        </button>

        <button
          onClick={() => updateFilter('dogFriendly', !filters.dogFriendly)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filters.dogFriendly
              ? 'bg-green-500 text-white shadow-lg shadow-green-200'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          )}
        >
          <Dog className="w-4 h-4" />
          Dog-Friendly
        </button>

        <button
          onClick={() => updateFilter('sunsetView', !filters.sunsetView)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filters.sunsetView
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-200'
              : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
          )}
        >
          <Sunset className="w-4 h-4" />
          Sunset Views
        </button>

        <button
          onClick={() => updateFilter('openNow', !filters.openNow)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filters.openNow
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          )}
        >
          Open Now
        </button>

        <button
          onClick={() => updateFilter('hiddenGems', !filters.hiddenGems)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filters.hiddenGems
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-200'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
          )}
        >
          Hidden Gems
        </button>
      </div>

      {/* Neighborhood Filter */}
      <div className={cn('mt-4 flex flex-wrap gap-2', showFilters ? 'flex' : 'hidden sm:flex')}>
        {neighborhoods.map((hood) => (
          <button
            key={hood}
            onClick={() => updateFilter('neighborhood', hood)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              filters.neighborhood === hood
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            )}
          >
            {hood}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="mt-4 text-sm text-amber-600 hover:text-amber-700 underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}