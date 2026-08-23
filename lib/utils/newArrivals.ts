import type { Product } from '@/types';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Returns true if the product was created within 30 days of referenceDate.
 * @param product - The product to check
 * @param referenceDate - The reference date (defaults to now)
 */
export function isNewArrival(product: Product, referenceDate: Date = new Date()): boolean {
  const createdAt = new Date(product._createdAt).getTime();
  const refTime = referenceDate.getTime();
  return refTime - createdAt <= THIRTY_DAYS_MS && createdAt <= refTime;
}
