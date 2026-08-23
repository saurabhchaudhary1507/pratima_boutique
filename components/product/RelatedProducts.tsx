import { ProductGrid } from '@/components/ui/ProductGrid';
import type { Product } from '@/types';

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return <section className="mt-20 border-t border-cream-300 pt-12" aria-labelledby="related-products-heading"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">You may also like</p><h2 id="related-products-heading" className="mt-2 text-display-sm text-brand-text-primary">Complete the look</h2><div className="mt-8"><ProductGrid products={products.slice(0, 6)} /></div></section>;
}
