import Link from 'next/link';
import { ProductGrid } from '@/components/ui/ProductGrid';
import type { Product } from '@/types';

interface NewArrivalsSectionProps {
  products: Product[];
  isFallback: boolean;
}

export function NewArrivalsSection({ products, isFallback }: NewArrivalsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-screen-2xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24" aria-labelledby="new-arrivals-heading">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">Fresh in boutique</p>
          <h2 id="new-arrivals-heading" className="mt-2 text-display-sm text-brand-text-primary">New arrivals</h2>
        </div>
        <Link href="/catalogue" className="font-semibold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded">View all pieces</Link>
      </div>
      <ProductGrid products={products} showNewBadge={!isFallback} />
    </section>
  );
}
