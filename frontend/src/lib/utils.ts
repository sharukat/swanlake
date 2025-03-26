import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformText(text: string) {
  const transformed = text.replace(/^"|"$/g, '');
  return transformed; 
}
