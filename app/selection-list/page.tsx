'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSelectionList } from '@/store/selectionList';

export default function SelectionListPage() {
  const { items, removeItem, clearAll } = useSelectionList();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-screen-2xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <header className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">Your boutique visit</p>
          <h1 className="mt-2 text-display-md text-brand-text-primary">Selection list</h1>
        </header>
        <EmptyState title="Your selection list is empty" message="Save pieces you love, then bring this list to Pratima Boutique to try them in person." ctaLabel="Browse the catalogue" ctaHref="/catalogue" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">Your boutique visit</p>
          <h1 className="mt-2 text-display-md text-brand-text-primary">Selection list</h1>
          <p className="mt-3 text-brand-text-secondary">{items.length} saved {items.length === 1 ? 'piece' : 'pieces'}</p>
        </header>
        <button type="button" onClick={() => setIsConfirmOpen(true)} className="rounded border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Clear all</button>
      </div>

      <aside className="mt-8 rounded-lg border border-champagne-300 bg-champagne-50 p-5 text-brand-text-primary" aria-label="In-store purchase note">
        <h2 className="font-serif text-lg font-semibold">Try and purchase in store</h2>
        <p className="mt-1 leading-7">This list helps guide your visit. Availability can change, and all purchases are completed at Pratima Boutique.</p>
      </aside>

      <ul className="mt-8 divide-y divide-cream-300 rounded-lg border border-cream-300 bg-white">
        {items.map((item) => (
          <li key={`${item.productId}-${item.selectedSize ?? ''}-${item.selectedColour ?? ''}`} className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
            <Link href={`/products/${item.slug}`} className="relative block aspect-[3/4] w-full shrink-0 overflow-hidden rounded bg-cream-100 sm:w-28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
              {item.thumbnail ? <Image src={item.thumbnail} alt={`${item.name} thumbnail`} fill sizes="112px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-sm text-brand-text-light">No image</span>}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${item.slug}`} className="font-serif text-xl font-semibold text-brand-text-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded">{item.name}</Link>
              <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-brand-text-secondary">
                {item.selectedSize && <div><dt className="sr-only">Size</dt><dd>Size: {item.selectedSize}</dd></div>}
                {item.selectedColour && <div><dt className="sr-only">Colour</dt><dd>Colour: {item.selectedColour}</dd></div>}
              </dl>
              <p className="mt-3 font-semibold text-brand-text-primary">£{item.price.toFixed(2)}</p>
            </div>
            <button type="button" onClick={() => removeItem(item.productId, item.selectedSize, item.selectedColour)} className="self-start rounded px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Remove<span className="sr-only"> {item.name}</span></button>
          </li>
        ))}
      </ul>

      <ConfirmationDialog isOpen={isConfirmOpen} title="Clear your selection list?" message="This removes all saved pieces from this browser." confirmLabel="Clear all" onConfirm={() => { clearAll(); setIsConfirmOpen(false); }} onCancel={() => setIsConfirmOpen(false)} />
    </div>
  );
}
