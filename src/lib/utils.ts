import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDateStr(date: string, opt: Intl.DateTimeFormatOptions) {
  return parseDate(new Date(Date.parse(date)), opt)
}

export function parseDate(date: Date, opt: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString('en-us', opt)
}