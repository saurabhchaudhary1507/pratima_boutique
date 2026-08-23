import type { Metadata } from 'next';
import { FeaturedCollectionSection } from '@/components/home/FeaturedCollectionSection';
import { HeroBanner } from '@/components/home/HeroBanner';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { getActiveBanner, getNewArrivals, getSiteSettings } from '@/sanity/lib/fetch';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings?.metaTitle?.slice(0, 60) || 'Pratima Boutique — Ladies Wear',
    description: settings?.metaDescription?.slice(0, 160) || 'Discover elegant ladies wear at Pratima Boutique and plan your in-store visit.',
  };
}

export default async function HomePage() {
  const [banner, newArrivals, settings] = await Promise.all([
    getActiveBanner(),
    getNewArrivals(),
    getSiteSettings(),
  ]);

  return (
    <>
      <HeroBanner banner={banner} />
      <NewArrivalsSection products={newArrivals.products} isFallback={newArrivals.isFallback} />
      <FeaturedCollectionSection collections={settings?.featuredCollections ?? []} />
    </>
  );
}
