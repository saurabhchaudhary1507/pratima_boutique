# Design Document

## Pratima Boutique — Ladies Wear Showcase Website

---

## Overview

Pratima Boutique is a ladies wear showcase website that acts as a digital discovery platform — helping customers explore collections, browse the product catalogue, and build a personal selection list to guide their in-store visit. There is no checkout or online payment; all purchases happen at the boutique.

The design prioritises:
- **Elegance and brand identity** — feminine aesthetic, refined typography, warm colour palette
- **Performance** — optimised images, server-side rendering, incremental static regeneration
- **Accessibility** — WCAG 2.1 AA compliance throughout
- **Admin simplicity** — headless CMS that requires no code changes to update content
- **Correctness** — selection list, filtering, and search logic verified with property-based tests

---

## Architecture

### Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | Server Components, ISR with `revalidatePath`/`revalidateTag`, built-in image optimisation, file-based routing with dynamic segments, excellent SEO support |
| Language | **TypeScript** | Type safety across data models, CMS schemas, and API layer |
| CMS | **Sanity (v3)** | Headless CMS with structured content, GROQ query language, real-time webhooks for <60 s revalidation, Sanity Studio embedded at `/studio` |
| Styling | **Tailwind CSS** | Utility-first, responsive-by-default, pairs well with the component model |
| State (client) | **Zustand** | Lightweight store for Selection_List (persisted to localStorage via `zustand/middleware/persist`) |
| Email | **Resend** | Developer-friendly transactional email API, Server Action integration, React Email templates |
| Deployment | **Vercel** | Native Next.js support, Edge Network CDN, webhook endpoints, `revalidateTag` support |
| Maps | **Google Maps Embed API** | Simple iframe embed for the Contact page |
| Testing | **Vitest + fast-check** | Property-based testing with fast-check; React Testing Library for component tests |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser (Customer)                         │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Next.js App (React Server + Client Components)               │  │
│  │  ┌─────────────┐  ┌───────────────────┐  ┌────────────────┐  │  │
│  │  │ Static Pages│  │  Dynamic RSC Pages │  │ Client Islands │  │  │
│  │  │ (homepage,  │  │ (product, category,│  │ (gallery, nav, │  │  │
│  │  │  catalogue) │  │  collection pages) │  │  selection list│  │  │
│  │  └──────┬──────┘  └────────┬──────────┘  └───────┬────────┘  │  │
│  └─────────┼──────────────────┼───────────────────── ┼───────────┘  │
└────────────┼──────────────────┼─────────────────────-┼─────────────┘
             │ fetch at build/  │ fetch on-demand       │ Zustand
             │ ISR revalidate   │ with cache tags       │ localStorage
             ▼                  ▼                       │
┌──────────────────────────────────┐                   │
│         Sanity Content Lake      │                   │
│  ┌────────────────────────────┐  │  GROQ webhook     │
│  │  Sanity Studio (/studio)   │  │──────────────────►│
│  │  (Admin interface)         │  │  Next.js /api/    │
│  └────────────────────────────┘  │  revalidate       │
└──────────────────────────────────┘                   │
                                                        ▼
                                         ┌─────────────────────────┐
                                         │  Resend Email API        │
                                         │  (contact form Server    │
                                         │   Action)                │
                                         └─────────────────────────┘
```

### Rendering Strategy

| Page | Strategy | Rationale |
|---|---|---|
| Homepage | ISR (`revalidateTag('homepage')`) | Content changes via CMS; revalidated on Sanity webhook |
| Catalogue | ISR (`revalidateTag('catalogue')`) | Product changes trigger revalidation |
| Product detail | ISR per slug (`revalidateTag('product-{slug}')`) | Individual product updates |
| Collection pages | ISR per slug (`revalidateTag('collection-{slug}')`) | Collection updates |
| Selection List | Client-only (CSR) | Stored in localStorage; no server state |
| Contact page | Static (no dynamic data) | Contact info is static |
| Search results | Server-side (no cache) | Query-dependent, must always be fresh |

Sanity GROQ-powered webhooks call `POST /api/revalidate` with a signed payload. The handler uses `revalidateTag` to invalidate only the affected pages, achieving the ≤60 second freshness requirement (Req 1.3, 6.4, 8.4).

---

## Components and Interfaces

### Page Structure

```
app/
├── layout.tsx                  ← Root layout: Nav, Footer, SelectionListProvider
├── page.tsx                    ← Homepage
├── catalogue/
│   └── page.tsx                ← Catalogue (with filter/sort sidebar)
├── products/
│   └── [slug]/
│       └── page.tsx            ← Product detail page
├── collections/
│   ├── page.tsx                ← Collections index
│   └── [slug]/
│       └── page.tsx            ← Single collection page
├── selection-list/
│   └── page.tsx                ← Selection List (CSR)
├── search/
│   └── page.tsx                ← Search results
├── contact/
│   └── page.tsx                ← Contact / Visit Us
├── api/
│   ├── revalidate/
│   │   └── route.ts            ← Sanity webhook handler
│   └── contact/
│       └── route.ts            ← Contact form email endpoint
└── studio/
    └── [[...tool]]/
        └── page.tsx            ← Embedded Sanity Studio
```

### Component Hierarchy

```
RootLayout
├── SiteHeader
│   ├── Logo (placeholder SVG → real logo later)
│   ├── NavLinks (desktop)
│   ├── HamburgerMenu (mobile, <768 px)
│   ├── SearchBar
│   └── SelectionListBadge (client, shows count from Zustand store)
├── <page content>
└── SiteFooter
    ├── ContactInfo (address, phone)
    ├── FooterNav
    └── BrandTagline

Pages:
HomePage
├── HeroBanner (CMS-driven, full-bleed)
├── NewArrivalsSection
│   └── ProductCard[]
└── FeaturedCollectionSection
    └── ProductCard[]

CataloguePage
├── FilterSidebar (Category, Colour, Size)
├── SortSelector
├── ProductCountBadge
└── ProductGrid
    └── ProductCard (thumbnail, name, price, New/Sale badges)

ProductDetailPage
├── ProductGallery (prev/next controls, lightbox)
├── ProductInfo
│   ├── ProductName
│   ├── PriceDisplay (struck-through original + current)
│   ├── VariantSelector (size, colour with OOS labels)
│   └── AddToSelectionListButton (disabled state with prompt)
└── RelatedProducts
    └── ProductCard[]

CollectionPage
├── CollectionHeader (cover image, name, description)
└── ProductGrid
    └── ProductCard[]

SelectionListPage (CSR)
├── InStoreNote
├── SelectionListItem[] (thumbnail, name, size, colour, price, remove)
├── ClearAllButton (with confirmation dialog)
└── EmptyState (→ Catalogue link)

ContactPage
├── ContactDetails (address, phone, hours)
├── MapEmbed
└── ContactForm (name, email, message, validation, Resend submit)
```

---

## Data Models

All types are defined in TypeScript and mirror Sanity schema documents.

### Product

```typescript
interface ProductVariant {
  size: string;           // e.g. "XS" | "S" | "M" | "L" | "XL"
  colour: string;         // e.g. "Ivory" | "Rose"
  inStock: boolean;
}

interface Product {
  _id: string;
  _type: 'product';
  _createdAt: string;     // ISO 8601 — drives New_Arrivals logic
  slug: { current: string };  // e.g. "floral-wrap-dress"
  name: string;
  description: string;   // portable text / rich text
  price: number;          // current selling price (GBP pence or decimal)
  originalPrice?: number; // if set and > price → sale badge
  images: SanityImageAsset[];  // 1–10 images
  categories: Reference<Category>[];
  collections?: Reference<Collection>[];
  variants: ProductVariant[];
  isActive: boolean;      // false = deactivated / hidden
}
```

### Category

```typescript
interface Category {
  _id: string;
  _type: 'category';
  name: string;           // e.g. "Dresses"
  slug: { current: string };
}
```

### Collection

```typescript
interface Collection {
  _id: string;
  _type: 'collection';
  name: string;           // e.g. "Summer 2025"
  slug: { current: string };  // e.g. "summer-2025"
  description: string;
  coverImage: SanityImageAsset;
  products: Reference<Product>[];
  isActive: boolean;
}
```

### HeroBanner (CMS-managed)

```typescript
interface HeroBanner {
  _id: string;
  _type: 'heroBanner';
  image: SanityImageAsset;
  altText: string;
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaLink?: string;
  isActive: boolean;      // only one active banner shown at a time
}
```

### SiteSettings (singleton document)

```typescript
interface SiteSettings {
  _type: 'siteSettings';
  featuredCollections: Reference<Collection>[];  // shown on homepage
  metaTitle: string;
  metaDescription: string;
}
```

### Selection_List (client-side only)

```typescript
interface SelectionListItem {
  productId: string;
  slug: string;
  name: string;
  thumbnail: string;      // URL string (resolved from Sanity asset)
  selectedSize?: string;
  selectedColour?: string;
  price: number;
}

interface SelectionListState {
  items: SelectionListItem[];
  addItem: (item: SelectionListItem) => void;
  removeItem: (productId: string, size?: string, colour?: string) => void;
  clearAll: () => void;
  hasItem: (productId: string, size?: string, colour?: string) => boolean;
}
```

The `SelectionListState` is managed by Zustand with the `persist` middleware writing to `localStorage` under the key `pratima-selection-list`.

**Deduplication key**: `productId + selectedSize + selectedColour` — the same product in different sizes/colours counts as distinct items. The same product+size+colour combination is treated as a duplicate (Req 5.2).

### ContactFormPayload

```typescript
interface ContactFormPayload {
  name: string;         // required
  email: string;        // required, valid email format
  message: string;      // required
}
```

---

## CMS Integration

### Sanity Schema Overview

Sanity Studio is embedded at `/studio` using the `next-sanity` package. Schemas defined in `sanity/schemas/`:

```
sanity/
├── schemas/
│   ├── product.ts
│   ├── category.ts
│   ├── collection.ts
│   ├── heroBanner.ts
│   └── siteSettings.ts
├── lib/
│   ├── client.ts       ← Sanity client (read token for server, public for client)
│   └── queries.ts      ← All GROQ queries
└── sanity.config.ts
```

### GROQ Query Examples

```groq
// New Arrivals (last 30 days, up to 8, newest first)
*[_type == "product" && isActive == true
  && dateTime(_createdAt) > dateTime(now()) - 60*60*24*30]
  | order(_createdAt desc)[0...8] {
    _id, _createdAt, name, slug, price, originalPrice,
    "thumbnail": images[0].asset->url
  }

// Catalogue — all active products with optional category filter
*[_type == "product" && isActive == true
  && ($categorySlug == null || $categorySlug in categories[]->slug.current)]
  | order(_createdAt desc) {
    _id, _createdAt, name, slug, price, originalPrice, variants,
    categories[]->{ name, slug },
    "thumbnail": images[0].asset->url
  }

// Product detail by slug
*[_type == "product" && slug.current == $slug && isActive == true][0] {
  ...,
  images[]{ asset->{ url, metadata } },
  categories[]->{ name, slug },
  collections[]->{ name, slug }
}

// Related products (same collection first, then same category)
*[_type == "product" && isActive == true && _id != $productId
  && ($collectionId in collections[]._ref || $categoryId in categories[]._ref)]
  | order(
    ($collectionId in collections[]._ref) desc,
    _createdAt desc
  )[0...6] {
    _id, name, slug, price, originalPrice,
    "thumbnail": images[0].asset->url
  }
```

### Webhook Revalidation Flow

1. Admin publishes/updates content in Sanity Studio
2. Sanity fires a GROQ-powered webhook to `POST /api/revalidate` with a signed payload
3. The handler validates the webhook signature using `parseBody` from `next-sanity`
4. Based on `_type` in the payload, it calls the appropriate `revalidateTag`:
   - `product` → `revalidateTag('catalogue')`, `revalidateTag('product-{slug}')`
   - `collection` → `revalidateTag('collections')`, `revalidateTag('collection-{slug}')`
   - `heroBanner` or `siteSettings` → `revalidateTag('homepage')`
5. Next.js purges the relevant ISR cache entries; next request regenerates the page

This flow ensures all content changes appear on the live site within ≤60 seconds (Req 1.3, 6.4, 8.4).

---

## State Management — Selection_List

The Selection_List is managed entirely client-side using Zustand with `persist` middleware.

```typescript
// store/selectionList.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSelectionList = create<SelectionListState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        if (get().hasItem(newItem.productId, newItem.selectedSize, newItem.selectedColour)) return;
        set((state) => ({ items: [...state.items, newItem] }));
      },
      removeItem: (productId, size, colour) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.selectedSize === size && i.selectedColour === colour)
          ),
        })),
      clearAll: () => set({ items: [] }),
      hasItem: (productId, size, colour) =>
        get().items.some(
          (i) => i.productId === productId && i.selectedSize === size && i.selectedColour === colour
        ),
    }),
    { name: 'pratima-selection-list' }
  )
);
```

### Deactivated Product Handling (Req 8.4)

When a product is deactivated in the CMS, a Sanity webhook fires. The `/api/revalidate` handler also calls a lightweight cleanup: any product IDs in the client's Selection_List that no longer resolve to an active product are flagged as stale. The Selection_List page fetches current product data on mount and silently removes stale items, displaying a banner: *"Some items in your list are no longer available and have been removed."*

---

## Image Optimisation Strategy

All product and banner images are served via `next/image`, which handles:

- **Format negotiation**: Automatically serves WebP or AVIF to supporting browsers; falls back to JPEG/PNG (Req 9.3)
- **Responsive `srcSet`**: Multiple sizes generated at 640, 828, 1080, 1920 px widths
- **Lazy loading**: Default `loading="lazy"` applied to all images below the fold (Req 9.4)
- **LCP optimisation**: Hero banner and first product image above the fold use `priority` prop (sets `fetchpriority="high"`, disables lazy loading) to avoid LCP degradation (Req 9.4)
- **Blur placeholder**: `placeholder="blur"` with `blurDataURL` from Sanity's LQIP metadata
- **CLS prevention**: Explicit `width` and `height` props on all `<Image>` instances

```tsx
// Hero banner — above fold, must not be lazy loaded
<Image
  src={banner.imageUrl}
  alt={banner.altText}
  priority                  // fetchpriority="high", no lazy loading
  fill
  sizes="100vw"
/>

// Product thumbnail — below fold
<Image
  src={product.thumbnail}
  alt={`${product.name} — product image`}
  width={400}
  height={500}
  loading="lazy"            // explicit for clarity (default)
  placeholder="blur"
  blurDataURL={product.blurDataUrl}
/>
```

**Sanity CDN**: Images are stored in Sanity's asset pipeline and served via Sanity's CDN with `?w=800&auto=format` query parameters for server-side format negotiation as a secondary optimisation layer.

---

## SEO Approach

### Metadata Generation

Each page uses Next.js App Router `generateMetadata` to produce unique `<title>` and `<meta name="description">` tags (Req 9.1):

```typescript
// app/products/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} | Pratima Boutique`.slice(0, 60),
    description: product.description.slice(0, 160),
    openGraph: {
      images: [product.images[0].url],
    },
  };
}
```

Title template: `{Page name} | Pratima Boutique` — guaranteed unique per page.

### URL Slugs

Slugs are enforced via Sanity schema validation (Req 9.5):

- Products: `/products/{slug}` — e.g. `/products/floral-wrap-dress`
- Collections: `/collections/{slug}` — e.g. `/collections/summer-2025`
- Categories: `/catalogue?category={slug}` — filter param, not a separate route

Slug generation rule: lowercase, replace spaces/special chars with hyphens, strip all other characters:
```
"Floral Wrap Dress" → "floral-wrap-dress"
```

Pattern: `^[a-z0-9]+(-[a-z0-9]+)*$`

### Sitemap

`app/sitemap.ts` uses Next.js's built-in sitemap generation (Req 9.2):

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, categories] = await Promise.all([
    getAllProductSlugs(),
    getAllCollectionSlugs(),
    getAllCategories(),
  ]);
  return [
    { url: 'https://pratimaboutique.com/', priority: 1.0 },
    { url: 'https://pratimaboutique.com/catalogue', priority: 0.9 },
    { url: 'https://pratimaboutique.com/collections', priority: 0.8 },
    { url: 'https://pratimaboutique.com/contact', priority: 0.5 },
    ...products.map((p) => ({ url: `https://pratimaboutique.com/products/${p.slug}`, priority: 0.7 })),
    ...collections.map((c) => ({ url: `https://pratimaboutique.com/collections/${c.slug}`, priority: 0.6 })),
  ];
}
```

---

## Responsive Design and Accessibility

### Breakpoint System (Tailwind defaults)

| Breakpoint | Width | Layout change |
|---|---|---|
| `sm` | 640 px | 2-column product grid |
| `md` | 768 px | Full nav visible; hamburger hidden |
| `lg` | 1024 px | 3-column product grid; filter sidebar visible |
| `xl` | 1280 px | 4-column product grid |
| `2xl` | 1536 px | Max container width capped at 1440 px |

### Hamburger Navigation

- Below 768 px: `<HamburgerMenu>` renders; full nav links hidden
- Toggling hamburger updates `isOpen` state; full nav slides in as a drawer
- Focus is trapped inside the open drawer (via `focus-trap-react`)
- `aria-expanded` on the hamburger button reflects open/closed state
- `Escape` key closes the drawer

### Accessibility Checklist (per WCAG 2.1 AA, Req 7.2–7.4)

- All product/banner images: `alt` text required (Sanity schema enforces `altText` field)
- Decorative images: `alt=""` explicitly set
- Colour contrast: Tailwind palette chosen to meet 4.5:1 for body text, 3:1 for large text
- Focus indicators: Tailwind `focus-visible:ring-2 ring-offset-2` utility applied to all interactive elements, ring colour chosen for 3:1 contrast against backgrounds
- Interactive elements: all buttons and links have accessible names
- Form fields: associated `<label>` elements for all inputs
- ARIA roles: `role="navigation"` on `<nav>`, `aria-label` on landmark regions
- Skip-to-content link at top of each page

---

## Contact Form / Email Sending

The contact form submits via a **Next.js Server Action** to keep email credentials server-side:

```typescript
// app/contact/actions.ts
'use server';
import { Resend } from 'resend';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function submitContactForm(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'website@pratimaboutique.com',
    to: process.env.BOUTIQUE_EMAIL!,
    subject: `New enquiry from ${parsed.data.name}`,
    text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
  });
  if (error) {
    return { success: false, sendError: true };
  }
  return { success: true };
}
```

Client-side behavior:
- On `success: true` → show confirmation banner for ≥2 s, reset form (Req 10.4)
- On `errors` → highlight missing fields, retain filled values (Req 10.5)
- On `sendError: true` → show "submission could not be completed" error, retain all form data (Req 10.6)

Field-level validation is performed both client-side (on blur, for UX) and server-side (in the Server Action, for correctness).

---

## API / Data Layer Design

All data fetching is centralised in `lib/sanity/queries.ts` and called from React Server Components. No client-side data fetching for CMS content.

### Query Functions

```typescript
// lib/sanity/queries.ts

export const getNewArrivals = cache(async (): Promise<Product[]> => {
  return client.fetch(NEW_ARRIVALS_QUERY, {}, { next: { tags: ['homepage'] } });
});

export const getCatalogueProducts = cache(async (
  categorySlug?: string,
  sort?: 'newest' | 'price-asc' | 'price-desc',
  filters?: FilterState
): Promise<Product[]> => {
  return client.fetch(CATALOGUE_QUERY, { categorySlug, ...filters }, { next: { tags: ['catalogue'] } });
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  return client.fetch(PRODUCT_BY_SLUG_QUERY, { slug }, { next: { tags: [`product-${slug}`] } });
});

export const getCollectionBySlug = cache(async (slug: string): Promise<Collection | null> => {
  return client.fetch(COLLECTION_QUERY, { slug }, { next: { tags: [`collection-${slug}`] } });
});

export const searchProducts = async (term: string): Promise<Product[]> => {
  // No cache — always fresh
  return client.fetch(SEARCH_QUERY, { term });
};
```

### Search Implementation

Search uses GROQ's `match` operator for case-insensitive full-text matching (Req 4.2):

```groq
*[_type == "product" && isActive == true && (
  name match $term + "*" ||
  description match $term + "*" ||
  count(categories[name match $term + "*"]) > 0
)] | order(_createdAt desc) {
  _id, name, slug, price, originalPrice,
  "thumbnail": images[0].asset->url
}
```

Search term is validated to 1–200 characters before the query is issued. Empty or oversized terms return a validation error without making a GROQ call (Req 4.4).

### Filter and Sort Logic

Client-side filter state is tracked in component state (not Zustand — it's transient, not persisted). Filter updates trigger a new server fetch with updated GROQ parameters. The approach keeps filtering server-authoritative and avoids shipping the full catalogue to the client.

Sort is applied in GROQ:
- `newest` → `| order(_createdAt desc)`
- `price-asc` → `| order(price asc)`
- `price-desc` → `| order(price desc)`

---

## Correctness Properties

### Property 1: New Arrivals Window and Order

*For any* set of products with varying `_createdAt` dates, the `getNewArrivals` filtering function shall return only products created within the last 30 days, ordered by `_createdAt` descending, with a maximum of 8 results.

**Validates: Requirements 1.2**

### Property 2: Product Card Renders Required Fields

*For any* product object with populated name, thumbnail, and price fields, the `ProductCard` component render shall include the product name, a non-empty `src` on the thumbnail image, and the formatted price.

**Validates: Requirements 1.4, 3.1**

### Property 3: Catalogue Excludes Deactivated Products

*For any* mix of active and deactivated products returned from the data layer, the catalogue display function shall never include any product where `isActive === false`.

**Validates: Requirements 2.1, 6.1**

### Property 4: Category Filter Correctness

*For any* selected category slug and any product catalogue, all products returned by the category filter function shall belong to the selected category and have `isActive === true`.

**Validates: Requirements 2.2, 6.2**

### Property 5: Conjunctive Filter Correctness

*For any* combination of filter criteria (category, colour, size) and any product catalogue, all products in the filtered result shall satisfy every active filter predicate simultaneously.

**Validates: Requirements 2.3**

### Property 6: Sort Order Invariants

*For any* non-empty product list, sorting by `price-asc` shall produce a list where every adjacent pair satisfies `price[i] <= price[i+1]`; sorting by `price-desc` shall satisfy `price[i] >= price[i+1]`; sorting by `newest` shall satisfy `_createdAt[i] >= _createdAt[i+1]`.

**Validates: Requirements 2.5**

### Property 7: New Badge Correctness

*For any* product, the `isNewArrival(product, referenceDate)` function shall return `true` if and only if the product's `_createdAt` is within 30 days of `referenceDate`, and the `ProductCard` render shall include the "New" badge exactly when this condition holds.

**Validates: Requirements 2.6**

### Property 8: Sale Badge and Price Display Correctness

*For any* product where `originalPrice` is set and `price < originalPrice`, the `ProductCard` render shall include the "Sale" badge and the product detail page shall display the original price with a strikethrough and the current price in a contrasting style, with both values simultaneously visible.

**Validates: Requirements 2.7, 3.4**

### Property 9: Out-of-Stock Variant Guard

*For any* product with at least one out-of-stock variant, when that variant is selected and the "Add to Selection List" action is triggered, the Selection_List shall remain unchanged and a message indicating unavailability shall be displayed.

**Validates: Requirements 3.5, 3.7**

### Property 10: Related Products Priority Invariant

*For any* product with a known collection and category, the related products result shall first be filled from products in the same collection before including products from the same category but a different collection, and the total count shall be between 1 and 6.

**Validates: Requirements 3.8**

### Property 11: Search Returns Exactly Matching Products

*For any* non-empty search term (≤200 characters) and any product catalogue, the search result shall contain exactly those active products whose `name`, `description`, or category name includes the search term as a case-insensitive substring, and shall contain no other products.

**Validates: Requirements 4.2**

### Property 12: Search Input Validation

*For any* search input that is either empty (length 0) or exceeds 200 characters, the search validation function shall return an error result and shall not produce a GROQ query.

**Validates: Requirements 4.4**

### Property 13: Selection List Add — Round Trip Persistence

*For any* valid `SelectionListItem`, after calling `addItem` and then serialising the Zustand store to localStorage and deserialising it back, the item shall be present in the restored list with all fields intact.

**Validates: Requirements 5.1, 5.6**

### Property 14: Selection List Duplicate Guard

*For any* Selection_List that already contains an item with a given `(productId, selectedSize, selectedColour)` key, calling `addItem` with the same key shall leave the list unchanged — same length, same contents.

**Validates: Requirements 5.2**

### Property 15: Selection List Count Invariant

*For any* Selection_List state, the count displayed in the navigation badge shall equal `items.length`. After any `addItem`, `removeItem`, or `clearAll` operation, this invariant shall hold.

**Validates: Requirements 5.4**

### Property 16: Selection List Remove Correctness

*For any* Selection_List with at least one item, after calling `removeItem` for that item's key, the item shall no longer appear in the list and the list length shall be exactly one less than before.

**Validates: Requirements 5.5**

### Property 17: Add Button Disabled When Variant Unselected

*For any* product that has size options and/or colour options, when neither a size nor a colour has been selected, the `AddToSelectionListButton` component shall render in a disabled state with the instructional prompt visible.

**Validates: Requirements 5.10**

### Property 18: SEO Metadata Character Limits

*For any* product, collection, or category, the `generateMetadata` function shall produce a `title` of at most 60 characters and a `description` of at most 160 characters, both non-empty.

**Validates: Requirements 9.1**

### Property 19: Sitemap Completeness

*For any* set of products, collections, and categories in the data layer, the generated `sitemap.xml` shall include a URL entry for every active product page, collection page, and the catalogue page. No active public page shall be missing from the sitemap.

**Validates: Requirements 9.2**

### Property 20: Slug Format Invariant

*For any* product name, collection name, or category name string, the `generateSlug` utility function shall produce a string matching the pattern `^[a-z0-9]+(-[a-z0-9]+)*$` — lowercase letters, digits, and hyphens only, no leading or trailing hyphens.

**Validates: Requirements 9.5**

### Property 21: Contact Form Validation — Missing Fields

*For any* subset of required contact form fields (name, email, message) that is left empty, the form validation function shall return an error result that names every empty field, and shall preserve the non-empty field values in the returned state.

**Validates: Requirements 10.5**

### Property 22: Product Image Alt Text

*For any* product with images, every `<img>` or `<Image>` element rendered for that product shall have a non-empty `alt` attribute.

**Validates: Requirements 7.2**

## Error Handling

| Scenario | Behaviour |
|---|---|
| Sanity fetch fails (timeout / network) | Server Component renders a fallback empty state with a user-friendly message; logged to server console. No unhandled exception. |
| Product slug not found | `notFound()` called → Next.js renders the 404 page |
| Collection slug not found | `notFound()` called → Next.js renders the 404 page |
| Contact form email fails (Resend error) | Server Action returns `{ sendError: true }`; client shows "could not complete" error and retains form data (Req 10.6) |
| Invalid webhook signature | `POST /api/revalidate` returns 401; no cache invalidation performed |
| localStorage unavailable (private mode) | `try/catch` around Zustand persist; Selection_List degrades to session-only (in-memory) with a UI notice |
| Image load failure | `onError` handler replaces with a branded placeholder SVG |
| Out-of-stock variant selected + add attempted | Blocked at UI level (disabled button) and at store level (guard function); returns error message (Req 3.7) |

---

## Testing Strategy

### Dual Testing Approach

Both unit/example tests and property-based tests are used. They are complementary:
- **Unit tests** cover specific examples, edge cases, integration points, and UI interactions
- **Property tests** verify universal correctness across all valid inputs

### Property-Based Tests (fast-check, min 100 iterations each)

Each property test is tagged: `// Feature: ladies-wear-boutique-website, Property N: <property text>`

Properties to implement as fast-check tests:
- Properties 1–22 listed above
- Generators needed: `ProductArb`, `CollectionArb`, `CategoryArb`, `SelectionListItemArb`, `FilterStateArb`, `SearchTermArb`

### Unit / Example Tests (Vitest + React Testing Library)

- Homepage renders hero, new arrivals, and featured collection sections
- Product gallery prev/next navigation
- Hamburger menu opens/closes on mobile viewport
- Clear All selection list prompts confirmation, then empties list
- Contact form shows confirmation on success
- Empty search term shows validation message
- No-results state on filtered catalogue
- Empty selection list shows empty state + catalogue link

### Integration Tests

- Sanity webhook handler revalidates correct cache tags
- Resend email is called with correct parameters on form submit
- Deactivated product is removed from catalogue within revalidation window

### Smoke Tests / Static Analysis

- WCAG contrast ratios (axe-core in CI)
- All pages render without hydration errors
- Lighthouse CI: ≥80 performance score on homepage, catalogue, and product detail pages on mobile preset
- WebP/AVIF image format configuration verified in `next.config.ts`
- Sanity schema validation (required fields enforced)

### Test File Structure

```
__tests__/
├── unit/
│   ├── newArrivals.test.ts
│   ├── slugGeneration.test.ts
│   ├── selectionList.test.ts
│   └── contactFormValidation.test.ts
├── property/
│   ├── newArrivals.property.test.ts      ← Properties 1, 7
│   ├── catalogue.property.test.ts        ← Properties 3–6, 8
│   ├── product.property.test.ts          ← Properties 2, 9–10
│   ├── search.property.test.ts           ← Properties 11–12
│   ├── selectionList.property.test.ts    ← Properties 13–17
│   ├── seo.property.test.ts              ← Properties 18–20
│   └── contactForm.property.test.ts      ← Properties 21–22
└── integration/
    ├── revalidate.test.ts
    └── contactForm.integration.test.ts
```
