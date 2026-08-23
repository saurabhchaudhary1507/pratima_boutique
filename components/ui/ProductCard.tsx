import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { isNewArrival } from '@/lib/utils/newArrivals';

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean; // false for fallback new arrivals
  priority?: boolean;     // true for above-fold cards
}

export function ProductCard({ product, showNewBadge = true, priority = false }: ProductCardProps) {
  const isNew = showNewBadge && isNewArrival(product);
  const isSale = product.originalPrice !== undefined && product.originalPrice > product.price;

  const productUrl = `/products/${product.slug.current}`;
  const thumbnailUrl = product.thumbnail ?? '';
  const blurDataUrl = product.blurDataUrl;

  return (
    <article className="group relative flex flex-col bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-250 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5" aria-hidden="true">
        {isNew && (
          <span className="inline-block bg-brand-primary text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            New
          </span>
        )}
        {isSale && (
          <span className="inline-block bg-champagne-600 text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Sale
          </span>
        )}
      </div>

      {/* Image */}
      <Link
        href={productUrl}
        className="block relative aspect-[3/4] bg-cream-100 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset"
        aria-label={`View ${product.name}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={`${product.name} — product thumbnail`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-450"
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
            {...(blurDataUrl ? { placeholder: 'blur', blurDataURL: blurDataUrl } : {})}
          />
        ) : (
          <div className="w-full h-full bg-cream-200 flex items-center justify-center">
            <span className="text-brand-text-light text-sm">No image</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5">
        <Link
          href={productUrl}
          className="font-serif text-base font-medium text-brand-text-primary hover:text-brand-primary transition-colors duration-200 line-clamp-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          {isSale && product.originalPrice !== undefined ? (
            <>
              <span className="text-sm text-brand-text-light line-through" aria-label={`Original price £${product.originalPrice.toFixed(2)}`}>
                £{product.originalPrice.toFixed(2)}
              </span>
              <span className="text-base font-semibold text-brand-primary" aria-label={`Sale price £${product.price.toFixed(2)}`}>
                £{product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-brand-text-primary">
              £{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
