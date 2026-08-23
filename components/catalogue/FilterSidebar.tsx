'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/types';

interface FilterSidebarProps {
  categories: Category[];
  colours: string[];
  sizes: string[];
}

type FilterName = 'category' | 'colour' | 'size';

function FilterGroup({ title, name, options, selected, onChange }: {
  title: string;
  name: FilterName;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (name: FilterName, value: string, checked: boolean) => void;
}) {
  if (options.length === 0) return null;

  return (
    <fieldset className="border-t border-cream-300 py-5">
      <legend className="font-serif text-lg font-semibold text-brand-text-primary">{title}</legend>
      <div className="mt-3 space-y-2">
        {options.map(({ value, label }) => {
          const id = `${name}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          return (
            <div key={value} className="flex items-center gap-3">
              <input id={id} type="checkbox" checked={selected.includes(value)} onChange={(event) => onChange(name, value, event.target.checked)} className="h-4 w-4 rounded border-ivory-600 text-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2" />
              <label htmlFor={id} className="cursor-pointer text-sm text-brand-text-secondary">{label}</label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterSidebar({ categories, colours, sizes }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCount = ['category', 'colour', 'size'].reduce((count, name) => count + searchParams.getAll(name).length, 0);

  const updateFilter = (name: FilterName, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const values = params.getAll(name).filter((item) => item !== value);
    if (checked) values.push(value);
    params.delete(name);
    values.forEach((item) => params.append(name, item));
    router.push(`/catalogue${params.size ? `?${params.toString()}` : ''}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ['category', 'colour', 'size'].forEach((name) => params.delete(name));
    router.push(`/catalogue${params.size ? `?${params.toString()}` : ''}`);
  };

  return (
    <aside className="rounded-lg bg-cream-100 p-5 lg:sticky lg:top-6" aria-label="Catalogue filters">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-semibold text-brand-text-primary">Filter by</h2>
        {activeCount > 0 && <button type="button" onClick={clearFilters} className="text-sm font-semibold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded">Clear all</button>}
      </div>
      <div className="mt-2">
        <FilterGroup title="Category" name="category" options={categories.map((category) => ({ value: category.slug.current, label: category.name }))} selected={searchParams.getAll('category')} onChange={updateFilter} />
        <FilterGroup title="Colour" name="colour" options={colours.map((colour) => ({ value: colour, label: colour }))} selected={searchParams.getAll('colour')} onChange={updateFilter} />
        <FilterGroup title="Size" name="size" options={sizes.map((size) => ({ value: size, label: size }))} selected={searchParams.getAll('size')} onChange={updateFilter} />
      </div>
    </aside>
  );
}
