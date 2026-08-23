'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductImage } from '@/types';

export function ProductGallery({ productName, images }: { productName: string; images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (images.length === 0) return <div className="aspect-[3/4] rounded-lg bg-cream-100" aria-label="Product image unavailable" />;

  const activeImage = images[activeIndex];
  const previous = () => setActiveIndex((index) => (index - 1 + images.length) % images.length);
  const next = () => setActiveIndex((index) => (index + 1) % images.length);

  return (
    <div>
      <div className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-cream-100">
        {activeImage.url && <Image src={activeImage.url} alt={activeImage.altText || `${productName} — image ${activeIndex + 1}`} fill priority={activeIndex === 0} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" {...(activeImage.lqip ? { placeholder: 'blur', blurDataURL: activeImage.lqip } : {})} />}
        {images.length > 1 && <>
          <button type="button" onClick={previous} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl text-brand-text-primary shadow-card hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">‹</button>
          <button type="button" onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl text-brand-text-primary shadow-card hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">›</button>
        </>}
      </div>
      {images.length > 1 && <div className="mt-4 grid grid-cols-5 gap-3" aria-label="Product image thumbnails">
        {images.map((image, index) => <button type="button" key={image._key ?? image.url ?? index} onClick={() => setActiveIndex(index)} aria-label={`Show image ${index + 1}`} aria-pressed={index === activeIndex} className={`relative aspect-square overflow-hidden rounded border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${index === activeIndex ? 'border-brand-primary' : 'border-transparent'}`}>
          {image.url && <Image src={image.url} alt="" fill sizes="100px" className="object-cover" />}
        </button>)}
      </div>}
    </div>
  );
}
