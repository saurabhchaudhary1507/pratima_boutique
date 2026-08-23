import type { Metadata } from 'next';
import { FilterSidebar } from '@/components/catalogue/FilterSidebar';
import { SortSelector } from '@/components/catalogue/SortSelector';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductCountBadge } from '@/components/ui/ProductCountBadge';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { getAllCategories, getAllColours, getAllSizes, getCatalogueProducts } from '@/sanity/lib/fetch';
import type { SortOption } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse elegant ladies wear, accessories, and new arrivals at Pratima Boutique.',
};

interface CataloguePageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const getValues = (value: string | string[] | undefined) => typeof value === 'string' ? [value] : value ?? [];

const validSort = (value: string | string[] | undefined): SortOption => {
  const sort = typeof value === 'string' ? value : '';
  return sort === 'price-asc' || sort === 'price-desc' ? sort : 'newest';
};

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const categories = getValues(searchParams.category);
  const colours = getValues(searchParams.colour);
  const sizes = getValues(searchParams.size);
  const sort = validSort(searchParams.sort);
  const [products, allCategories, allColours, allSizes] = await Promise.all([
    getCatalogueProducts({ categorySlugs: categories, colours, sizes, sort }),
    getAllCategories(),
    getAllColours(),
    getAllSizes(),
  ]);
  const hasActiveFilters = categories.length > 0 || colours.length > 0 || sizes.length > 0;

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">Explore the boutique</p>
        <h1 className="mt-2 text-display-md text-brand-text-primary">Shop all</h1>
        <p className="mt-4 leading-7 text-brand-text-secondary">Find pieces you love, save them to your selection list, and try them in store.</p>
      </header>
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <FilterSidebar categories={allCategories} colours={allColours} sizes={allSizes} />
        <section aria-label="Catalogue products">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <ProductCountBadge count={products.length} />
            <SortSelector value={sort} />
          </div>
          {products.length > 0 ? <ProductGrid products={products} /> : <EmptyState title="No matching pieces" message="No products match the filters you selected. Try clearing a filter or browse the full catalogue." ctaLabel={hasActiveFilters ? 'Clear all filters' : 'Browse all pieces'} ctaHref="/catalogue" />}
        </section>
      </div>
    </div>
  );
}
