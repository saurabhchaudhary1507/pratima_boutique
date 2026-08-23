import { cache } from 'react';
import { client } from './client';
import {
  HERO_BANNER_QUERY,
  NEW_ARRIVALS_QUERY,
  NEW_ARRIVALS_FALLBACK_QUERY,
  SITE_SETTINGS_QUERY,
  CATALOGUE_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  RELATED_PRODUCTS_QUERY,
  COLLECTIONS_INDEX_QUERY,
  COLLECTION_BY_SLUG_QUERY,
  SEARCH_QUERY,
  ALL_PRODUCT_SLUGS_QUERY,
  ALL_COLLECTION_SLUGS_QUERY,
  ALL_CATEGORIES_QUERY,
  ALL_COLOURS_QUERY,
  ALL_SIZES_QUERY,
} from './queries';
import type {
  Product,
  Collection,
  Category,
  HeroBanner,
  SiteSettings,
  SortOption,
} from '@/types';

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------

export const getActiveBanner = cache(async (): Promise<HeroBanner | null> => {
  return client.fetch(HERO_BANNER_QUERY, {}, { next: { tags: ['homepage'] } });
});

export const getNewArrivals = cache(
  async (): Promise<{ products: Product[]; isFallback: boolean }> => {
    const recent = await client.fetch<Product[]>(
      NEW_ARRIVALS_QUERY,
      {},
      { next: { tags: ['homepage'] } }
    );
    if (recent && recent.length > 0) {
      return { products: recent, isFallback: false };
    }
    // Fallback: 8 most recent products, no "New" badge
    const fallback = await client.fetch<Product[]>(
      NEW_ARRIVALS_FALLBACK_QUERY,
      {},
      { next: { tags: ['homepage'] } }
    );
    return { products: fallback ?? [], isFallback: true };
  }
);

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return client.fetch(SITE_SETTINGS_QUERY, {}, { next: { tags: ['homepage'] } });
});

// ---------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------

export const getCatalogueProducts = cache(
  async (options?: {
    categorySlugs?: string[];
    colours?: string[];
    sizes?: string[];
    sort?: SortOption;
  }): Promise<Product[]> => {
    const params = {
      categorySlugs: options?.categorySlugs ?? [],
      colours: options?.colours ?? [],
      sizes: options?.sizes ?? [],
    };
    const products = await client.fetch<Product[]>(CATALOGUE_QUERY, params, {
      next: { tags: ['catalogue'] },
    });

    if (!products) return [];

    // Apply sort in JS since GROQ sort needs to be in the query string
    const sort = options?.sort ?? 'newest';
    return sortProducts(products, sort);
  }
);

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  if (sort === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    // newest: sort by _createdAt desc
    sorted.sort(
      (a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
    );
  }
  return sorted;
}

export const getAllCategories = cache(async (): Promise<Category[]> => {
  return client.fetch(ALL_CATEGORIES_QUERY, {}, { next: { tags: ['catalogue'] } });
});

export const getAllColours = cache(async (): Promise<string[]> => {
  return client.fetch(ALL_COLOURS_QUERY, {}, { next: { tags: ['catalogue'] } });
});

export const getAllSizes = cache(async (): Promise<string[]> => {
  return client.fetch(ALL_SIZES_QUERY, {}, { next: { tags: ['catalogue'] } });
});

// ---------------------------------------------------------------------------
// Product detail
// ---------------------------------------------------------------------------

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  return client.fetch(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
    { next: { tags: [`product-${slug}`] } }
  );
});

export const getRelatedProducts = cache(
  async (
    productId: string,
    collectionIds: string[],
    categoryIds: string[]
  ): Promise<Product[]> => {
    return client.fetch(
      RELATED_PRODUCTS_QUERY,
      { productId, collectionIds, categoryIds },
      { next: { tags: [`product-${productId}`] } }
    );
  }
);

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export const getCollectionsIndex = cache(async (): Promise<Collection[]> => {
  return client.fetch(COLLECTIONS_INDEX_QUERY, {}, { next: { tags: ['collections'] } });
});

export const getCollectionBySlug = cache(async (slug: string): Promise<Collection | null> => {
  return client.fetch(
    COLLECTION_BY_SLUG_QUERY,
    { slug },
    { next: { tags: [`collection-${slug}`] } }
  );
});

// ---------------------------------------------------------------------------
// Search (no cache — always fresh, Req 4.2)
// ---------------------------------------------------------------------------

export async function searchProducts(term: string): Promise<Product[]> {
  // Validation — should be pre-validated by caller, but guard here too
  if (!term || term.length === 0 || term.length > 200) {
    return [];
  }
  // No cache wrapper — search must always return fresh results
  return client.fetch(SEARCH_QUERY, { term });
}

// ---------------------------------------------------------------------------
// Sitemap / static params
// ---------------------------------------------------------------------------

export const getAllProductSlugs = cache(async (): Promise<string[]> => {
  return client.fetch(ALL_PRODUCT_SLUGS_QUERY, {}, { next: { tags: ['catalogue'] } });
});

export const getAllCollectionSlugs = cache(async (): Promise<string[]> => {
  return client.fetch(ALL_COLLECTION_SLUGS_QUERY, {}, { next: { tags: ['collections'] } });
});
