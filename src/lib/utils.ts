import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function isOpenNow(hours: Record<string, { open: string; close: string; closed?: boolean }>): boolean {
  const now = new Date();
  const dayMap: Record<number, string> = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat'
  };
  
  const today = dayMap[now.getDay()];
  const todayHours = hours[today];
  
  if (!todayHours || todayHours.closed) return false;
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  
  const openTime = openHour * 60 + openMin;
  let closeTime = closeHour * 60 + closeMin;
  
  // Handle past midnight closing
  if (closeTime < openTime) {
    closeTime += 24 * 60;
    return currentTime >= openTime || currentTime <= closeTime - 24 * 60;
  }
  
  return currentTime >= openTime && currentTime <= closeTime;
}

export function getTodayHours(hours: Record<string, { open: string; close: string; closed?: boolean }>): string {
  const now = new Date();
  const dayMap: Record<number, string> = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat'
  };
  
  const today = dayMap[now.getDay()];
  const todayHours = hours[today];
  
  if (!todayHours || todayHours.closed) return 'Closed today';
  
  return `${formatTime(todayHours.open)} - ${formatTime(todayHours.close)}`;
}

export function getNeighborhoodColor(neighborhood: string): string {
  const colors: Record<string, string> = {
    'Downtown': 'bg-blue-100 text-blue-700',
    'Beltline': 'bg-purple-100 text-purple-700',
    'Kensington': 'bg-pink-100 text-pink-700',
    'Mission': 'bg-orange-100 text-orange-700',
    'Inglewood': 'bg-green-100 text-green-700',
    'East Village': 'bg-cyan-100 text-cyan-700',
    'Hillhurst': 'bg-amber-100 text-amber-700',
    'Highland Park': 'bg-teal-100 text-teal-700',
    'Ramsay': 'bg-indigo-100 text-indigo-700'
  };
  
  return colors[neighborhood] || 'bg-gray-100 text-gray-700';
}

// Last visited functionality using localStorage (client-side only)
export function getLastVisited(patioId: string): Date | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('lastVisited');
  if (!stored) return null;
  
  const data = JSON.parse(stored);
  return data[patioId] ? new Date(data[patioId]) : null;
}

export function setLastVisited(patioId: string): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem('lastVisited');
  const data = stored ? JSON.parse(stored) : {};
  data[patioId] = new Date().toISOString();
  localStorage.setItem('lastVisited', JSON.stringify(data));
}

export function formatLastVisited(date: Date): string {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}