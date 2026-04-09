import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge classNames with Tailwind CSS support
 * Combines clsx for flexible class strings with twMerge to handle Tailwind conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
