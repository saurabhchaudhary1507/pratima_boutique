'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { SortOption } from '@/types';

export function SortSelector({ value }: { value: SortOption }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changeSort = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === 'newest') params.delete('sort');
    else params.set('sort', sort);
    router.push(`/catalogue${params.size ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort-select" className="text-sm font-medium text-brand-text-secondary">Sort by</label>
      <select id="sort-select" value={value} onChange={(event) => changeSort(event.target.value as SortOption)} className="rounded border border-ivory-500 bg-white px-3 py-2 text-sm text-brand-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
        <option value="newest">Newest first</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </div>
  );
}
