import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  showNewBadge?: boolean;
}

export function ProductGrid({ products, showNewBadge = true }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <ul
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      aria-label={`${products.length} product${products.length !== 1 ? 's' : ''}`}
    >
      {products.map((product, index) => (
        <li key={product._id}>
          <ProductCard
            product={product}
            showNewBadge={showNewBadge}
            priority={index === 0}
          />
        </li>
      ))}
    </ul>
  );
}
