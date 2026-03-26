'use client';

import { useEffect, useState } from 'react';
import { Sun, Wind, Droplets, Thermometer, CloudRain, CloudSun } from 'lucide-react';
import { WeatherData, calculatePatioWeatherScore, getCurrentWeather } from '@/lib/weather';

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      const data = await getCurrentWeather();
      setWeather(data);
      setLoading(false);
    }
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-lg border border-amber-100">
        <div className="animate-pulse flex items-center gap-4">
          <div className="w-20 h-20 bg-amber-200 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-8 w-32 bg-amber-200 rounded" />
            <div className="h-4 w-24 bg-amber-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 shadow-lg border border-gray-200">
        <p className="text-gray-500">Weather data unavailable</p>
      </div>
    );
  }

  const patioScore = calculatePatioWeatherScore(weather);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-6 shadow-lg border border-amber-100 relative overflow-hidden">
      {/* Decorative sun rays */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-amber-900">Current Weather</h2>
            <p className="text-sm text-amber-600">Calgary, AB</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-5xl font-bold text-amber-900">{Math.round(weather.temperature)}°</span>
          </div>
        </div>

        {/* Patio Weather Score - PROMINENT */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-amber-200/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-bold text-amber-900">{patioScore.score}</span>
                <span className="text-lg text-amber-600">/ 100</span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                patioScore.rating === 'Perfect' ? 'bg-green-100 text-green-700' :
                patioScore.rating === 'Great' ? 'bg-emerald-100 text-emerald-700' :
                patioScore.rating === 'Good' ? 'bg-blue-100 text-blue-700' :
                patioScore.rating === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {patioScore.rating} Patio Weather
              </span>
            </div>
            <div className="w-20 h-20 relative">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-amber-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={patioScore.score >= 70 ? 'text-green-500' : patioScore.score >= 50 ? 'text-yellow-500' : 'text-orange-500'}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${patioScore.score}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {patioScore.sunnyNow ? (
                  <Sun className="w-8 h-8 text-amber-500 animate-pulse" />
                ) : (
                  <CloudSun className="w-8 h-8 text-amber-600" />
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-amber-700 mt-3">{patioScore.recommendation}</p>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-white/40 rounded-xl p-3">
            <Thermometer className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-amber-600">Feels like</p>
              <p className="font-semibold text-amber-900">{Math.round(weather.feelsLike)}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/40 rounded-xl p-3">
            <Wind className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-amber-600">Wind</p>
              <p className="font-semibold text-amber-900">{Math.round(weather.windSpeed)} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/40 rounded-xl p-3">
            <Droplets className="w-5 h-5 text-cyan-500" />
            <div>
              <p className="text-xs text-amber-600">Precipitation</p>
              <p className="font-semibold text-amber-900">{weather.precipitationProbability}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/40 rounded-xl p-3">
            <CloudRain className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-amber-600">Rain</p>
              <p className="font-semibold text-amber-900">{weather.precipitation} mm</p>
            </div>
          </div>
        </div>

        {/* Factor Scores */}
        <div className="mt-4 pt-4 border-t border-amber-200/50">
          <div className="grid grid-cols-4 gap-2 text-center">
            {Object.entries(patioScore.factors).map(([key, factor]) => (
              <div key={key} className="space-y-1">
                <div className="w-full bg-amber-100 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${
                      factor.score >= 70 ? 'bg-green-500' : factor.score >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <p className="text-xs text-amber-600 capitalize">{key}</p>
                <p className="text-xs font-medium text-amber-900">{factor.score}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}