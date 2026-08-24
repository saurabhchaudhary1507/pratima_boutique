import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from '@/sanity/lib/fetch';
import { portableTextToPlainText } from '@/lib/utils/portableText';

export const revalidate = 60;

export async function generateStaticParams() { const slugs = await getAllProductSlugs(); return slugs.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product not found' };
  return { title: `${product.name} | Pratima Boutique`.slice(0, 60), description: (portableTextToPlainText(product.description).slice(0, 160) || `Discover ${product.name} at Pratima Boutique.`), openGraph: product.images[0]?.url ? { images: [{ url: product.images[0].url }] } : undefined };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.isActive) notFound();
  const related = await getRelatedProducts(product._id, product.collections?.map((collection) => collection._id) ?? [], product.categories.map((category) => category._id));
  const description = portableTextToPlainText(product.description);
  const isSale = product.originalPrice !== undefined && product.originalPrice > product.price;
  return <div className="mx-auto max-w-screen-2xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16"><div className="grid gap-10 lg:grid-cols-2 lg:gap-16"><ProductGallery productName={product.name} images={product.images} /><div className="max-w-xl lg:pt-4"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">{product.categories[0]?.name ?? 'Pratima Boutique'}</p><h1 className="mt-3 text-display-md text-brand-text-primary">{product.name}</h1><div className="mt-5 flex items-center gap-3">{isSale && <span className="text-lg text-brand-text-light line-through">Rs.{product.originalPrice?.toFixed(2)}</span>}<span className={`text-2xl font-semibold ${isSale ? 'text-brand-primary' : 'text-brand-text-primary'}`}>Rs.{product.price.toFixed(2)}</span></div>{description && <p className="mt-6 leading-7 text-brand-text-secondary">{description}</p>}<ProductPurchasePanel product={product} /></div></div><RelatedProducts products={related} /></div>;
}
