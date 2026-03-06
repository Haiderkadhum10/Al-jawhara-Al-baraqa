import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * دمج أصناف Tailwind بشكل آمن مع دعم conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-IQ").format(price);
}

export function parsePrice(priceStr: string): number {
  return Number(priceStr.replace(/[^0-9.-]+/g, ""));
}
