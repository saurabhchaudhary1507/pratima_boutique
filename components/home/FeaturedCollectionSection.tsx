import Image from 'next/image';
import Link from 'next/link';
import { ProductGrid } from '@/components/ui/ProductGrid';
import type { Collection } from '@/types';

interface FeaturedCollectionSectionProps {
  collections: Collection[];
}

export function FeaturedCollectionSection({ collections }: FeaturedCollectionSectionProps) {
  const activeCollections = collections.filter((collection) => collection.isActive);
  if (activeCollections.length === 0) return null;

  return (
    <section className="bg-cream-100 py-16 lg:py-24" aria-label="Featured collections">
      <div className="mx-auto max-w-screen-2xl space-y-16 px-6 sm:px-10 lg:px-16">
        {activeCollections.map((collection) => {
          const imageUrl = collection.coverImage.asset.url;
          return (
            <article key={collection._id} className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12">
              <Link href={`/collections/${collection.slug.current}`} className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                {imageUrl && <Image src={imageUrl} alt={collection.coverImage.altText} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover transition-transform duration-450 group-hover:scale-105" {...(collection.coverImage.asset.metadata?.lqip ? { placeholder: 'blur', blurDataURL: collection.coverImage.asset.metadata.lqip } : {})} />}
              </Link>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">Featured collection</p>
                <h2 className="mt-2 text-display-sm text-brand-text-primary"><Link href={`/collections/${collection.slug.current}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded">{collection.name}</Link></h2>
                <p className="mt-4 max-w-2xl leading-7 text-brand-text-secondary">{collection.description}</p>
                {collection.products && collection.products.length > 0 && <div className="mt-8"><ProductGrid products={collection.products.slice(0, 4)} /></div>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
