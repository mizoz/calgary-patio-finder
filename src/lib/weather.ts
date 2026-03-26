// Weather API utilities for Calgary patio weather scoring
// Uses Open-Meteo API (free, no API key required)

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  precipitationProbability: number;
  weatherCode: number;
  isDay: boolean;
  uvIndex: number;
  cloudCover: number;
  visibility: number;
}

export interface PatioWeatherScore {
  score: number; // 0-100
  rating: 'Perfect' | 'Great' | 'Good' | 'Fair' | 'Poor';
  factors: {
    temperature: { score: number; label: string };
    wind: { score: number; label: string };
    precipitation: { score: number; label: string };
    comfort: { score: number; label: string };
  };
  recommendation: string;
  sunnyNow: boolean;
}

// Calgary coordinates
const CALGARY_LAT = 51.0447;
const CALGARY_LNG = -114.0719;

export async function getCurrentWeather(): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${CALGARY_LAT}&longitude=${CALGARY_LNG}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=uv_index,precipitation_probability&daily=sunrise,sunset,uv_index_max&timezone=America%2FEdmonton&forecast_days=1`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) throw new Error('Weather API failed');

    const data = await response.json();
    const current = data.current;
    
    // Get current hour for UV index
    const currentHour = new Date().getHours();
    
    return {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      precipitation: current.precipitation,
      precipitationProbability: data.hourly.precipitation_probability[currentHour] || 0,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
      uvIndex: data.hourly.uv_index[currentHour] || 0,
      cloudCover: current.cloud_cover,
      visibility: 10 // Open-Meteo doesn't provide visibility in free tier
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

export function calculatePatioWeatherScore(weather: WeatherData): PatioWeatherScore {
  // Temperature scoring (Calgary specific - locals enjoy 15-28°C)
  let tempScore = 0;
  let tempLabel = '';
  
  if (weather.temperature >= 20 && weather.temperature <= 26) {
    tempScore = 100;
    tempLabel = 'Ideal temperature';
  } else if (weather.temperature >= 15 && weather.temperature <= 30) {
    tempScore = 85;
    tempLabel = 'Great temperature';
  } else if (weather.temperature >= 10 && weather.temperature <= 32) {
    tempScore = 70;
    tempLabel = 'Comfortable';
  } else if (weather.temperature >= 5 && weather.temperature <= 35) {
    tempScore = 50;
    tempLabel = 'A bit cool' + (weather.temperature > 30 ? 'warm' : 'cool');
  } else if (weather.temperature < 5) {
    tempScore = 25;
    tempLabel = 'Bundle up!';
  } else {
    tempScore = 30;
    tempLabel = 'Stay hydrated';
  }

  // Wind scoring (Calgary is windy)
  let windScore = 0;
  let windLabel = '';
  
  if (weather.windSpeed <= 10) {
    windScore = 100;
    windLabel = 'Calm';
  } else if (weather.windSpeed <= 20) {
    windScore = 85;
    windLabel = 'Light breeze';
  } else if (weather.windSpeed <= 30) {
    windScore = 65;
    windLabel = 'Breezy';
  } else if (weather.windSpeed <= 40) {
    windScore = 40;
    windLabel = 'Windy';
  } else {
    windScore = 20;
    windLabel = 'Very windy';
  }

  // Precipitation scoring
  let precipScore = 0;
  let precipLabel = '';
  
  if (weather.precipitation === 0 && weather.precipitationProbability < 20) {
    precipScore = 100;
    precipLabel = 'No rain expected';
  } else if (weather.precipitation === 0 && weather.precipitationProbability < 40) {
    precipScore = 85;
    precipLabel = 'Low chance of rain';
  } else if (weather.precipitation === 0) {
    precipScore = 60;
    precipLabel = 'Rain possible';
  } else if (weather.precipitation < 2) {
    precipScore = 40;
    precipLabel = 'Light rain';
  } else {
    precipScore = 15;
    precipLabel = 'Rainy';
  }

  // Comfort factor (humidity, UV, feels like)
  let comfortScore = 100;
  let comfortLabel = 'Comfortable';
  
  // Humidity adjustment
  if (weather.humidity > 70) {
    comfortScore -= 10;
    comfortLabel = 'A bit humid';
  }
  
  // UV adjustment
  if (weather.uvIndex > 7) {
    comfortScore -= 10;
    comfortLabel = 'High UV - wear sunscreen';
  }
  
  // Feels like adjustment
  const tempDiff = Math.abs(weather.feelsLike - weather.temperature);
  if (tempDiff > 5) {
    comfortScore -= 10;
  }

  comfortScore = Math.max(50, Math.min(100, comfortScore));

  // Calculate overall score (weighted average)
  const score = Math.round(
    tempScore * 0.4 + 
    windScore * 0.25 + 
    precipScore * 0.25 + 
    comfortScore * 0.1
  );

  // Determine rating
  let rating: PatioWeatherScore['rating'];
  if (score >= 85) rating = 'Perfect';
  else if (score >= 70) rating = 'Great';
  else if (score >= 55) rating = 'Good';
  else if (score >= 35) rating = 'Fair';
  else rating = 'Poor';

  // Generate recommendation
  let recommendation = '';
  if (score >= 85) {
    recommendation = "Perfect patio weather! Grab your sunglasses and head out.";
  } else if (score >= 70) {
    recommendation = "Great conditions for outdoor dining. Don't forget sunscreen!";
  } else if (score >= 55) {
    recommendation = "Decent patio weather. Consider a heated or covered spot.";
  } else if (score >= 35) {
    recommendation = "Look for a heated or covered patio to stay comfortable.";
  } else {
    recommendation = "Maybe stick to indoor dining today, or find a fully covered heated patio.";
  }

  // Determine if sunny now
  const sunnyNow = weather.precipitation === 0 && 
                   weather.weatherCode <= 3 && 
                   weather.cloudCover < 50;

  return {
    score,
    rating,
    factors: {
      temperature: { score: tempScore, label: tempLabel },
      wind: { score: windScore, label: windLabel },
      precipitation: { score: precipScore, label: precipLabel },
      comfort: { score: comfortScore, label: comfortLabel }
    },
    recommendation,
    sunnyNow
  };
}

// Weather code descriptions (WMO codes)
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  
  return descriptions[code] || 'Unknown';
}

// Get weather icon name for lucide
export function getWeatherIcon(code: number): string {
  if (code === 0 || code === 1) return 'sun';
  if (code === 2) return 'cloud-sun';
  if (code === 3) return 'cloud';
  if (code >= 45 && code <= 48) return 'cloud-fog';
  if (code >= 51 && code <= 67) return 'cloud-rain';
  if (code >= 71 && code <= 77) return 'cloud-snow';
  if (code >= 80 && code <= 82) return 'cloud-rain';
  if (code >= 85 && code <= 86) return 'cloud-snow';
  if (code >= 95) return 'cloud-lightning';
  return 'cloud';
}

// Calculate patio season countdown (May long weekend - Victoria Day)
export function getPatioSeasonCountdown(): { 
  days: number; 
  startDate: Date; 
  isPatioSeason: boolean;
  message: string;
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Victoria Day is the Monday on or before May 24
  // Formula: May 24 - (day of week of May 24) days + 1 (to get Monday)
  const may24 = new Date(currentYear, 4, 24); // Month is 0-indexed
  const dayOfWeek = may24.getDay();
  const victoriaDay = new Date(currentYear, 4, 24 - ((dayOfWeek + 6) % 7));
  
  // Patio season ends around mid-September (Labour Day-ish is peak end)
  const patioSeasonEnd = new Date(currentYear, 8, 15); // Sept 15
  
  const isPatioSeason = now >= victoriaDay && now <= patioSeasonEnd;
  
  let days: number;
  let message: string;
  
  if (isPatioSeason) {
    const daysLeft = Math.ceil((patioSeasonEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    days = daysLeft;
    message = `Patio season is ON! ${daysLeft} days of prime patio weather left`;
  } else if (now < victoriaDay) {
    days = Math.ceil((victoriaDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    message = `${days} days until patio season!`;
  } else {
    // After patio season, calculate for next year
    const nextVictoriaDay = new Date(currentYear + 1, 4, 24 - ((new Date(currentYear + 1, 4, 24).getDay() + 6) % 7));
    days = Math.ceil((nextVictoriaDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    message = `${days} days until patio season returns!`;
  }
  
  return { days, startDate: victoriaDay, isPatioSeason, message };
}