'use client';

import { useMemo, useState } from 'react';
import { useSelectionList } from '@/store/selectionList';
import type { Product } from '@/types';

const buttonClass = (selected: boolean) => `rounded border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${selected ? 'border-brand-primary bg-rose-50 text-brand-primary' : 'border-ivory-500 bg-white text-brand-text-primary hover:border-brand-primary'}`;

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem, hasItem } = useSelectionList();
  const sizes = useMemo(() => [...new Set(product.variants.map((variant) => variant.size).filter(Boolean))], [product.variants]);
  const colours = useMemo(() => [...new Set(product.variants.map((variant) => variant.colour).filter(Boolean))], [product.variants]);
  const [size, setSize] = useState<string | undefined>();
  const [colour, setColour] = useState<string | undefined>();
  const [message, setMessage] = useState('');
  const variant = product.variants.find((item) => item.size === (size ?? '') && item.colour === (colour ?? ''));
  const requiresSize = sizes.length > 0;
  const requiresColour = colours.length > 0;
  const needsSelection = (requiresSize && !size) || (requiresColour && !colour);

  const showMessage = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(''), 2500); };
  const addToList = () => {
    if (needsSelection) return;
    if (!variant?.inStock) { showMessage('This selected variant is currently unavailable.'); return; }
    if (hasItem(product._id, size, colour)) { showMessage('This item is already in your selection list.'); return; }
    addItem({ productId: product._id, slug: product.slug.current, name: product.name, thumbnail: product.images[0]?.url ?? '', selectedSize: size, selectedColour: colour, price: product.price });
    showMessage('Added to your selection list.');
  };

  return <div className="mt-8 space-y-7">
    {requiresSize && <fieldset><legend className="font-semibold text-brand-text-primary">Select size</legend><div className="mt-3 flex flex-wrap gap-2">{sizes.map((option) => <button type="button" key={option} onClick={() => setSize(option)} className={buttonClass(size === option)} aria-pressed={size === option}>{option}</button>)}</div></fieldset>}
    {requiresColour && <fieldset><legend className="font-semibold text-brand-text-primary">Select colour</legend><div className="mt-3 flex flex-wrap gap-2">{colours.map((option) => <button type="button" key={option} onClick={() => setColour(option)} className={buttonClass(colour === option)} aria-pressed={colour === option}>{option}</button>)}</div></fieldset>}
    {variant && !variant.inStock && <p className="font-semibold text-rose-800" role="status">Out of Stock</p>}
    <div><button type="button" disabled={needsSelection} onClick={addToList} className="w-full rounded bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-secondary disabled:cursor-not-allowed disabled:bg-ivory-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Add to Selection List</button>{needsSelection && <p className="mt-2 text-sm text-brand-text-secondary">Select {requiresSize && requiresColour ? 'a size and colour' : requiresSize ? 'a size' : 'a colour'} to add this piece.</p>}{message && <p className="mt-3 font-medium text-brand-primary" role="status">{message}</p>}</div>
  </div>;
}
