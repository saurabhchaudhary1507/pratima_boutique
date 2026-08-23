// ---------------------------------------------------------------------------
// Sanity asset types
// ---------------------------------------------------------------------------

export interface SanityImageAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  altText?: string;
}

export interface Reference<T = unknown> {
  _ref: string;
  _type: 'reference';
  _key?: string;
  // Resolved type when dereferenced
  _resolved?: T;
}

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export interface ProductVariant {
  _key?: string;
  size: string;
  colour: string;
  inStock: boolean;
}

export interface Product {
  _id: string;
  _type: 'product';
  _createdAt: string; // ISO 8601 — drives New_Arrivals logic
  slug: { current: string };
  name: string;
  description: PortableTextBlock[]; // portable text / rich text
  price: number; // current selling price
  originalPrice?: number; // if set and > price → sale badge
  images: ProductImage[]; // 1–10 images
  categories: Category[];
  collections?: Collection[];
  variants: ProductVariant[];
  isActive: boolean;
  // Resolved thumbnail URL (from GROQ projection)
  thumbnail?: string;
  blurDataUrl?: string;
}

export interface ProductImage {
  _key?: string;
  url?: string;
  lqip?: string;
  width?: number;
  height?: number;
  altText: string;
}

export interface Category {
  _id: string;
  _type: 'category';
  name: string;
  slug: { current: string };
}

export interface Collection {
  _id: string;
  _type: 'collection';
  name: string;
  slug: { current: string };
  description: string;
  coverImage: {
    asset: {
      url?: string;
      metadata?: {
        lqip?: string;
        dimensions?: { width: number; height: number };
      };
    };
    altText: string;
  };
  products?: Product[];
  isActive: boolean;
}

export interface HeroBanner {
  _id: string;
  _type: 'heroBanner';
  image: {
    asset: {
      url?: string;
      metadata?: { lqip?: string };
    };
  };
  altText: string;
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaLink?: string;
  isActive: boolean;
}

export interface SiteSettings {
  _type: 'siteSettings';
  featuredCollections: Collection[];
  metaTitle: string;
  metaDescription: string;
}

// ---------------------------------------------------------------------------
// Selection List (client-side only, Zustand store)
// ---------------------------------------------------------------------------

export interface SelectionListItem {
  productId: string;
  slug: string;
  name: string;
  thumbnail: string; // Resolved URL string
  selectedSize?: string;
  selectedColour?: string;
  price: number;
}

export interface SelectionListState {
  items: SelectionListItem[];
  addItem: (item: SelectionListItem) => void;
  removeItem: (productId: string, size?: string, colour?: string) => void;
  clearAll: () => void;
  hasItem: (productId: string, size?: string, colour?: string) => boolean;
}

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------

export interface ContactFormPayload {
  name: string; // required
  email: string; // required, valid email format
  message: string; // required
}

export type ContactFormResult =
  | { success: true }
  | { success: false; errors: Record<string, string[]> }
  | { success: false; sendError: true };

// ---------------------------------------------------------------------------
// Filter and sort state
// ---------------------------------------------------------------------------

export interface FilterState {
  categories: string[]; // category slugs
  colours: string[];
  sizes: string[];
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

// ---------------------------------------------------------------------------
// Portable Text (minimal type for Next.js usage)
// ---------------------------------------------------------------------------

export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{
    _type: string;
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
}

// ---------------------------------------------------------------------------
// Sitemap helpers
// ---------------------------------------------------------------------------

export interface SlugItem {
  slug: { current: string };
}
