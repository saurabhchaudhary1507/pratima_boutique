import Image from 'next/image';
import Link from 'next/link';
import type { HeroBanner as HeroBannerData } from '@/types';

interface HeroBannerProps {
  banner: HeroBannerData | null;
}

/** The CMS-managed, above-the-fold visual for the homepage. */
export function HeroBanner({ banner }: HeroBannerProps) {
  if (!banner) {
    return (
      <section className="bg-rose-950 px-6 py-24 text-center text-white sm:px-10 lg:py-32" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-rose-200">Pratima Boutique</p>
          <h1 id="hero-heading" className="font-serif text-display-md sm:text-display-xl">Elegance for every occasion</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-rose-100 sm:text-lg">Discover thoughtfully selected ladies wear for your next boutique visit.</p>
          <Link href="/catalogue" className="mt-8 inline-flex rounded bg-white px-6 py-3 font-semibold text-rose-900 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rose-950">
            Browse the collection
          </Link>
        </div>
      </section>
    );
  }

  const imageUrl = banner.image.asset.url;

  return (
    <section className="relative isolate min-h-[30rem] overflow-hidden bg-rose-950 text-white sm:min-h-[36rem] lg:min-h-[42rem]" aria-labelledby="hero-heading">
      {imageUrl && (
        <Image src={imageUrl} alt={banner.altText} fill priority sizes="100vw" className="object-cover" {...(banner.image.asset.metadata?.lqip ? { placeholder: 'blur', blurDataURL: banner.image.asset.metadata.lqip } : {})} />
      )}
      <div className="absolute inset-0 bg-hero-overlay" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[30rem] max-w-screen-2xl items-end px-6 py-14 sm:min-h-[36rem] sm:px-10 lg:min-h-[42rem] lg:px-16 lg:py-20">
        <div className="max-w-2xl animate-slide-up">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">Pratima Boutique</p>
          <h1 id="hero-heading" className="font-serif text-display-md sm:text-display-xl">{banner.headline}</h1>
          {banner.subheadline && <p className="mt-5 max-w-xl text-base leading-7 text-white sm:text-lg">{banner.subheadline}</p>}
          {banner.ctaLabel && banner.ctaLink && <Link href={banner.ctaLink} className="mt-8 inline-flex rounded bg-white px-6 py-3 font-semibold text-rose-900 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rose-950">{banner.ctaLabel}</Link>}
        </div>
      </div>
    </section>
  );
}
