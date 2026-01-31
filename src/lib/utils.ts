import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWaitTime(minutes: number) {
  if (minutes < 1) {
    return "< 1m";
  }
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  let result = '';
  if (h > 0) {
    result += `${h}h `;
  }
  if (m > 0 || h === 0) {
    result += `${m}m`;
  }
  return result.trim();
}
