import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateId(id: string, length: number = 8) {
  if (!id) return "-";
  if (id.length <= length) return id;
  return `${id.slice(0, length)}...`;
}
